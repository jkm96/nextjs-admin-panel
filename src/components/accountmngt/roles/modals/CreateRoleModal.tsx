import React, {useEffect, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {getRegisteredPermissions} from "@/lib/services/accountmngt/roleService";
import {toast} from "react-toastify";
import {Permission} from "@/boundary/interfaces/permission";
import {groupPermissionsByGroup} from "@/helpers/permissionsHelper";
import {CreateRoleRequest} from "@/boundary/interfaces/role";
import {validateCreateRoleFormInputErrors} from "@/helpers/validationHelpers";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import Spinner from "@/components/shared/icons/Spinner";

const initialFormState: CreateRoleRequest = {
    description: "", name: "", roleClaims: []
};
export default function CreateRoleModal({isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createRoleFormData, setCreateRoleFormData] = useState<CreateRoleRequest>(initialFormState);
    const [inputErrors, setInputErrors] = useState({
        description: "", name: ""
    });
    const fetchPermissions = async () => {
        setIsLoading(true);
        await getRegisteredPermissions()
            .then((response) => {
                if (response.statusCode === 200) {
                    const permissions: Permission[] = response.data;
                    const groupedPermissions = groupPermissionsByGroup(permissions);
                    setGroupedPermissions(groupedPermissions);
                }
            })
            .catch((error) => {
                toast.error(`Error fetching permissions: ${error}`)
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen]);

    const handleCheckboxChange = (permission: Permission) => {
        setSelectedPermissions((prevSelected) => {
            const isAlreadySelected = prevSelected.some((selectedPermission) => selectedPermission.value === permission.value);

            if (isAlreadySelected) {
                // If already selected, remove it
                return prevSelected.filter((selectedPermission) => selectedPermission.value !== permission.value);
            } else {
                // If selected, add it to the array
                return [...prevSelected, {...permission, selected: true}];
            }
        });
    };

    useEffect(() => {
        setCreateRoleFormData({
            ...createRoleFormData,
            roleClaims: selectedPermissions
        })
    }, [selectedPermissions]);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setCreateRoleFormData({...createRoleFormData, [name]: value});
    }

    const handleRoleCreationSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true)

        const inputErrors = validateCreateRoleFormInputErrors(createRoleFormData);
        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            setIsSubmitting(false)
            return;
        }

        if (
            createRoleFormData.name.trim() === "" ||
            createRoleFormData.description.trim() === ""
        ) {
            setIsSubmitting(false)
            return;
        }

        if (!createRoleFormData.roleClaims.some((permission) => permission.selected)) {
            setIsSubmitting(false);
            toast.error("Please select at least one permission.");
            return;
        }

        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: createRoleFormData.name,
            dataBefore: JSON.stringify(initialFormState),
            dataAfter: JSON.stringify(createRoleFormData),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsRolesCreate),
            status: StagingRecordStatus.Pending,
            comments: "Request to add new role data"
        };
        const response = await upsertStagingRecord(stagingRequest)
        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.CreateInitiated,
                module: ApplicationModule.Roles,
                comment: "",
                dataAfter: JSON.stringify(initialFormState),
                dataBefore: JSON.stringify(createRoleFormData),
                description: `Initiated creation of role ${createRoleFormData.name}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            setCreateRoleFormData(initialFormState)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    }

    const handleCloseModal = () => {
        setCreateRoleFormData(initialFormState);
        setIsSubmitting(false)
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onClose();
                    handleCloseModal();
                }}
                onClose={onClose}
                size="5xl"
                placement="top-center"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Role</ModalHeader>
                            <ModalBody>
                                {isLoading ? (
                                    <div className="text-center">Loading permissions...</div>
                                ) : (
                                    <form onSubmit={handleRoleCreationSubmit}>
                                        <h3>Role Details</h3>
                                        <div className="grid md:grid-cols-2 md:gap-6">
                                            <Input type="email"
                                                   className="mt-2 mb-1 "
                                                   onChange={handleChange}
                                                   value={createRoleFormData.name}
                                                   label="Role name"
                                                   name="name"
                                                   variant={"bordered"}
                                                   placeholder="Enter role name"
                                                   onInput={() => {
                                                       setInputErrors({...inputErrors, name: ""});
                                                   }}
                                                   isInvalid={inputErrors.name !== ""}
                                                   errorMessage={inputErrors.name}/>

                                            <Input type="text"
                                                   onChange={handleChange}
                                                   value={createRoleFormData.description}
                                                   label="Description"
                                                   name="description"
                                                   className="mt-2 mb-1 "
                                                   variant={"bordered"}
                                                   placeholder="Enter description"
                                                   onInput={() => {
                                                       setInputErrors({...inputErrors, description: ""});
                                                   }}
                                                   isInvalid={inputErrors.description !== ""}
                                                   errorMessage={inputErrors.description}/>
                                        </div>

                                        <h3 className="mt-2 mb-2">Role Permissions</h3>
                                        <div className="grid md:grid-cols-2 md:gap-6">
                                            {Object.entries(groupedPermissions).map(([group, permissions]) => (
                                                <div key={group}>
                                                    <h2>{group}</h2>
                                                    <ul>
                                                        {permissions.map((permission) => (
                                                            <li key={permission.value}>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => handleCheckboxChange(permission)}
                                                                    />
                                                                    <span
                                                                        className="mr-2">{permission.description}</span>
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        spinner={<Spinner/>}
                                        onClick={handleRoleCreationSubmit}>
                                    {isSubmitting ? "Submitting..." : "Create Role"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

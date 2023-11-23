import {UpdateRolePermissionsRequest, UpdateRoleRequest} from "@/boundary/interfaces/role";
import {
    Button,
    CircularProgress,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import Spinner from "@/components/shared/icons/Spinner";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {toast} from "react-toastify";
import {getRegisteredPermissions} from "@/lib/services/accountmngt/roleService";
import {Permission} from "@/boundary/interfaces/permission";
import {groupPermissionsByGroup} from "@/helpers/permissionsHelper";

export default function UpdateRolePermissionModal({updateRolePermissionsRequest, isOpen, onClose}: {
    updateRolePermissionsRequest: UpdateRolePermissionsRequest,
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateRolePermissionsFormData, setUpdateRolePermissionsFormData] =
        useState<UpdateRolePermissionsRequest>(updateRolePermissionsRequest);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [selectedRoleClaims, setSelectedRoleClaims] = useState<Permission[]>([]);

    const fetchPermissions = async () => {
        setIsLoading(true);
        await getRegisteredPermissions()
            .then((response) => {
                if (response.statusCode === 200) {
                    const permissions: Permission[] = response.data;
                    const mappedPermissions = permissions.map(permission => ({
                        ...permission,
                        selected: updateRolePermissionsRequest.roleClaims.some(selectedPermission => selectedPermission.value === permission.value)
                    }));
                    const groupedPermissions = groupPermissionsByGroup(mappedPermissions);
                    setGroupedPermissions(groupedPermissions)
                } else {
                    toast.error(`Error fetching permissions: ${response.message}`);
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
            setSelectedRoleClaims(updateRolePermissionsRequest.roleClaims)
            fetchPermissions();
        }else{
            setSelectedRoleClaims([])
        }
    }, [isOpen,updateRolePermissionsRequest.roleClaims]);

    const handleCheckboxChange = (permission: Permission) => {
        setSelectedRoleClaims((prevSelected) => {
            console.log("prevSelected", prevSelected)
            const isAlreadySelected = prevSelected.some((selectedRoleClaim) => selectedRoleClaim.value === permission.value);
            console.log("isAlreadySelected", isAlreadySelected)
            if (isAlreadySelected) {
                // If already selected, remove it
                console.log("remove permission", permission)
                return prevSelected.filter((selectedRoleClaim) => selectedRoleClaim.value !== permission.value);
            } else {
                // If selected, add it to the array
                console.log("add permission", permission)
                return [...prevSelected, {...permission, selected: true}];
            }
        });
    };

    const handleRolePermissionsUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setIsSubmitting(true)

        updateRolePermissionsFormData.roleClaims = selectedRoleClaims;

        console.log("selectedRoleClaims", selectedRoleClaims)
        console.log("updated permissions", updateRolePermissionsFormData)
        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: updateRolePermissionsRequest.roleName,
            dataBefore: JSON.stringify(updateRolePermissionsRequest),
            dataAfter: JSON.stringify(updateRolePermissionsFormData),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsRoleClaimsEdit),
            status: StagingRecordStatus.Pending,
            comments: "Request to update role permissions"
        };

        // let response = await upsertStagingRecord(stagingRequest);

        // if (response.statusCode === 200) {
        //     const auditRequest: AuditRecordRequest = {
        //         auditType: AppAuditType.UpdateInitiated,
        //         module: ApplicationModule.Roles,
        //         comment: "Request to update role permissions",
        //         dataBefore: JSON.stringify(updateRolePermissionsRequest),
        //         dataAfter: JSON.stringify(updateRolePermissionsFormData),
        //         description: `Initiated update permissions for role ${updateRolePermissionsRequest.roleName}`,
        //     }
        //     await addAuditRecord(auditRequest);
        //     toast.success(response.message)
        //     setIsSubmitting(false)
        //     setUpdateRolePermissionsFormData(updateRolePermissionsRequest)
        //     onClose();
        // } else {
        //     setIsSubmitting(false)
        //     toast.error(response.message ?? "Unknown error occurred")
        // }
    };

    const handleCloseModal = () => {
        setIsSubmitting(false)
        setUpdateRolePermissionsFormData(updateRolePermissionsRequest)
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
                scrollBehavior={"inside"}
                placement="top-center"
                size="5xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Update {updateRolePermissionsRequest.roleName} Permissions
                            </ModalHeader>
                            <ModalBody>
                                {isLoading ? (
                                    <div className={"grid place-items-center"}>
                                        <CircularProgress color={"primary"} className={"p-4"}
                                                          label="Loading role permissions...."/>
                                    </div>
                                ) : (
                                    <>
                                        <form onSubmit={handleRolePermissionsUpdateSubmit}>
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
                                                                            defaultChecked={permission.selected}
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
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <div className="flex justify-end mt-4 gap-1">
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary"
                                            type="submit"
                                            isLoading={isSubmitting}
                                            spinner={<Spinner/>}
                                            onClick={handleRolePermissionsUpdateSubmit}
                                    >
                                        {isSubmitting ? "Submitting..." : "Update Permissions"}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
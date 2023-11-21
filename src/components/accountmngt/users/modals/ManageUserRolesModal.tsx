import {RoleResponse} from "@/boundary/interfaces/role";
import {
    Button, Checkbox,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {getRoles} from "@/lib/services/accountmngt/roleService";
import {toast} from "react-toastify";
import {UpdateUserRolesRequest, UserResponse, UserRoleModel} from "@/boundary/interfaces/user";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {useAuth} from "@/hooks/useAuth";
import Spinner from "@/components/shared/icons/Spinner";

const initialData: UpdateUserRolesRequest = {
    userId: "", userRoles: []
}
export default function ManageUserRolesModal({userCurrentRoles, userDetails, isOpen, onClose}: {
    userCurrentRoles: RoleResponse[],
    userDetails: UserResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [updateUserRolesRequest, setUpdateUserRolesRequest] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchRolesAndAddToUpdateForm = async () => {
        const queryParams = new RoleQueryParameters();
        queryParams.pageSize = 50;
        setIsLoadingRoles(true);
        await getRoles(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data} = parsedData;

                    const mappedRoles = data
                        .filter((role: any) => role.name !== "Administrator")
                        .map((role: any) => ({
                        roleName: role.name,
                        roleId: role.id,
                        roleDescription: role.description,
                        selected: userCurrentRoles.some((currentRole) => currentRole.id === role.id),
                    }));

                    setUpdateUserRolesRequest({
                        ...updateUserRolesRequest,
                        userRoles: mappedRoles,
                    });
                }
            })
            .catch((error) => {
                toast.error(`Error fetching roles: ${error}`);
            })
            .finally(() => {
                setIsLoadingRoles(false);
            });
    }


    useEffect(() => {
        if (isOpen) {
            fetchRolesAndAddToUpdateForm();
        }
    }, [isOpen, userCurrentRoles]);

    console.log("setUpdateUserRolesRequest", updateUserRolesRequest)
    const handleRoleCheckboxChange = (roleName: string, checked: boolean) => {
        const updatedRoles = updateUserRolesRequest.userRoles.map((role) =>
            role.roleName === roleName ? {...role, selected: checked} : role
        );

        setUpdateUserRolesRequest({
            ...updateUserRolesRequest,
            userRoles: updatedRoles,
        });
    };

    const handleUserRoleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true)

        const selectedRolesCount = updateUserRolesRequest.userRoles.filter((role) => role.selected).length;
        const currentUserRolesCount = userCurrentRoles.length;

        if (selectedRolesCount === 0) {
            setIsSubmitting(false);
            toast.error("Please select at least one role.");
            return;
        }

        if (selectedRolesCount <= currentUserRolesCount) {
            setIsSubmitting(false);
            toast.error("Selected roles already exist in the current user roles.");
            return;
        }

        updateUserRolesRequest.userId = userDetails.id;
        const dataBefore = {
            userId: userDetails.id,
            userRoles: userCurrentRoles
        }
        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: userDetails.email,
            dataBefore: JSON.stringify(dataBefore),
            dataAfter: JSON.stringify(updateUserRolesRequest),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsUsersManageRoles),
            status: StagingRecordStatus.Pending,
            comments: "Request to update user roles"
        };
        let response = await upsertStagingRecord(stagingRequest);

        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateInitiated,
                module: ApplicationModule.Users,
                comment: "",
                dataAfter: JSON.stringify(updateUserRolesRequest),
                dataBefore: JSON.stringify(dataBefore),
                description: `Initiated update roles for user ${userDetails.email}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            setUpdateUserRolesRequest(initialData)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onClose();
                }}
                onClose={onClose}
                scrollBehavior={"inside"}
                placement="top-center"
                size="5xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update User Roles</ModalHeader>
                            <ModalBody>
                                {isLoadingRoles ? (
                                    <div className={"text-center"}>
                                        <p>Loading roles...</p>
                                    </div>
                                ) : (
                                    <>
                                        <h3>Roles</h3>
                                        <form onSubmit={handleUserRoleUpdateSubmit}>
                                            <Table aria-label="Example table with dynamic content"
                                            >
                                                <TableHeader>
                                                    <TableColumn>Name</TableColumn>
                                                    <TableColumn>Description</TableColumn>
                                                    <TableColumn>Action</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {updateUserRolesRequest.userRoles.map((item: UserRoleModel) => (
                                                        <TableRow key={item.roleId}>
                                                            <TableCell>{item.roleName}</TableCell>
                                                            <TableCell>{item.roleDescription}</TableCell>
                                                            <TableCell>
                                                                <Checkbox
                                                                    defaultSelected={item.selected}
                                                                    onChange={(e) =>
                                                                        handleRoleCheckboxChange(item.roleName, e.target.checked)
                                                                    }
                                                                    color="success"
                                                                >
                                                                    Add
                                                                </Checkbox>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
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
                                            onClick={handleUserRoleUpdateSubmit}
                                    >
                                        {isSubmitting ? "Submitting..." : "Update"}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
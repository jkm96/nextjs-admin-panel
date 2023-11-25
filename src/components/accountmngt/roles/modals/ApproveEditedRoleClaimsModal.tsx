import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button, Checkbox, Chip
} from "@nextui-org/react";
import {StagingRecordStatus, StagingResponse, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {CreateUserRequest, User} from "@/boundary/interfaces/user";
import {toast} from "react-toastify";
import {createUser} from "@/lib/services/accountmngt/userService";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {useRouter} from "next/navigation";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {checkIfCanApproveAction} from "@/helpers/stagingHelpers";
import {CreateRoleRequest, UpdateRolePermissionsRequest} from "@/boundary/interfaces/role";
import {createRole, updateRolePermissions} from "@/lib/services/accountmngt/roleService";
import Spinner from "@/components/shared/icons/Spinner";
import {Permission} from "@/boundary/interfaces/permission";
import {CheckIcon} from "@/components/shared/icons/CheckIcon";
import {CrossIcon} from "@/components/shared/icons/CrossIcon";

export default function ApproveEditedRoleClaimsModal({stagingRecord, isOpen, onClose}: {
    stagingRecord: StagingResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const router = useRouter()
    const [canApprove, setCanApprove] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const {user} = useAuth();
    const [updateRolePermissionsRequest, setUpdateRolePermissionsRequest] =
        useState<UpdateRolePermissionsRequest>({} as UpdateRolePermissionsRequest);
    const [comment, setComment] = useState('');
    const [previousRoleClaims, setPreviousRoleClaims] = useState<Permission[]>([]);
    const [newRoleClaims, setNewRoleClaims] = useState<Permission[]>([]);
    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const jsonDataAfter = JSON.parse(stagingRecord.dataAfter);
        const jsonDataBefore = JSON.parse(stagingRecord.dataBefore);
        const updatedRoleClaims = jsonDataAfter.roleClaims.map((roleClaim: Permission) => ({
            ...roleClaim,
            selected: true
        }));

        const roleClaimRequest: UpdateRolePermissionsRequest = {
            roleName: jsonDataAfter.roleName,
            roleId: jsonDataAfter.roleId,
            roleClaims: updatedRoleClaims
        };
        setPreviousRoleClaims(jsonDataBefore.roleClaims)
        setNewRoleClaims(jsonDataAfter.roleClaims)
        setUpdateRolePermissionsRequest(roleClaimRequest)
    }, []);

    useEffect(() => {
        async function checkPermissions() {
            const canApproveAction = await hasRequiredPermissions(
                [MapPermission(AdminPortalPermission.PermissionsRoleClaimsApproveEdit)]
            );
            const canApprove = checkIfCanApproveAction(user, canApproveAction, stagingRecord.creator);
            setCanApprove(canApprove)
        }

        checkPermissions();
    }, []);

    async function handleApprove() {
        if (comment.length === 0) {
            toast.error("A comment is required")
            return;
        }
        setIsSubmitting(true)

        let response = await updateRolePermissions(updateRolePermissionsRequest);
        if (response.statusCode === 200) {
            toast.success(response.data ?? response.message)
            setIsSubmitting(false);

            const stagingRequest: StagingUpsertRequest = {
                id: stagingRecord.id,
                entity: updateRolePermissionsRequest.roleName,
                dataBefore: stagingRecord.dataBefore,
                dataAfter: stagingRecord.dataAfter,
                creator: user?.email,
                approverId: user?.id,
                action: MapPermission(AdminPortalPermission.PermissionsRoleClaimsEdit),
                status: StagingRecordStatus.Completed,
                comments: comment
            };
            const upsertResponse = await upsertStagingRecord(stagingRequest);
            if (upsertResponse.statusCode === 200) {
                const auditRequest: AuditRecordRequest = {
                    auditType: AppAuditType.CreateApproved,
                    module: ApplicationModule.Roles,
                    comment: comment,
                    dataAfter: stagingRecord.dataAfter,
                    dataBefore: stagingRecord.dataBefore,
                    description: `approved creation of role claims for role ${updateRolePermissionsRequest.roleName}`,
                }
                await addAuditRecord(auditRequest);
                router.push("/dashboard/roles")
            }
        } else {
            setIsSubmitting(false);
            toast.error(response.message ?? "Unknown error occurred")
        }
    }

    async function handleDecline() {
        if (comment.length === 0) {
            toast.error("A comment is required")
            return;
        }
        setIsDeclining(true)
        const stagingRequest: StagingUpsertRequest = {
            id: stagingRecord.id,
            entity: updateRolePermissionsRequest.roleName,
            dataBefore: JSON.stringify(stagingRecord.dataBefore),
            dataAfter: JSON.stringify({}),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsRoleClaimsEdit),
            status: StagingRecordStatus.Declined,
            comments: comment
        };
        const upsertResponse = await upsertStagingRecord(stagingRequest);
        if (upsertResponse.statusCode === 200) {
            setIsDeclining(false)
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateDeclined,
                module: ApplicationModule.Roles,
                comment: comment,
                dataAfter: JSON.stringify({}),
                dataBefore: JSON.stringify(stagingRecord.dataBefore),
                description: `declined creation of role claims for role ${updateRolePermissionsRequest.roleName}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(upsertResponse.message)
            onClose()
        } else {
            setIsDeclining(false)
            toast.error(upsertResponse.message)
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => onClose()}
                onClose={onClose}
                size="5xl"
                placement="top-center"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Approve New Role</ModalHeader>

                            {updateRolePermissionsRequest && (<ModalBody>

                                    <h3>Role Details</h3>

                                    <div className="grid gap-6 mb-1 md:grid-cols-1">
                                        <div>
                                            <label htmlFor="name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input type="text" id="name"
                                                   defaultValue={updateRolePermissionsRequest.roleName}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="John" disabled={true}/>
                                        </div>
                                    </div>

                                    <h3 className="mt-2 mb-2">Permissions</h3>

                                    <div className="grid gap-6 mb-1 md:grid-cols-2">
                                        <div>
                                            <h3>Previous Permissions</h3>
                                            <table
                                                className="overflow-y-auto h-10 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead
                                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Group
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Status
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {previousRoleClaims && previousRoleClaims.map((item) => (
                                                    <tr
                                                        key={item.value}
                                                        className={"dark:bg-gray-800"}
                                                    >
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {item.value}
                                                        </td>
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {item.group}
                                                        </td>
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            <Chip
                                                                startContent={<CrossIcon size={18}/>}
                                                                radius="full"
                                                                color={"danger"}
                                                                variant="light"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div>
                                            <h3>New Permissions</h3>
                                            <table
                                                className="overflow-y-auto h-10 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead
                                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Group
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Status
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {newRoleClaims && newRoleClaims.map((item) => (
                                                    <tr
                                                        key={item.value}
                                                        className={"dark:bg-gray-800"}
                                                    >
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {item.value}
                                                        </td>
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {item.group}
                                                        </td>
                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            <Chip
                                                                startContent={<CheckIcon size={18}/>}
                                                                radius="full"
                                                                color={"success"}
                                                                variant="light"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="large-input"
                                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comment</label>
                                        <input type="text" id="large-input"
                                               value={comment}
                                               onChange={handleCommentChange}
                                               placeholder="Type comment"
                                               className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50
                                    sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                    dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    </div>
                                </ModalBody>
                            )}
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                                {canApprove && (
                                    <>
                                        <Button
                                            color="danger"
                                            isLoading={isDeclining}
                                            spinner={<Spinner/>}
                                            onPress={handleDecline}>
                                            {isDeclining ? "Declining..." : "Decline"}
                                        </Button>
                                        <Button
                                            color="success"
                                            isLoading={isSubmitting}
                                            spinner={<Spinner/>}
                                            onPress={handleApprove}>
                                            {isSubmitting ? "Approving..." : "Approve"}
                                        </Button>
                                    </>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

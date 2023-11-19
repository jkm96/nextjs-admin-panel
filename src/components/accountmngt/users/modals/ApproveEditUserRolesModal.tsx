import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@nextui-org/react";
import {StagingRecordStatus, StagingResponse, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {CreateUserRequest, UpdateUserRolesRequest, User} from "@/boundary/interfaces/user";
import {toast} from "react-toastify";
import {createUser, updateUserRoles} from "@/lib/services/accountmngt/userService";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {useRouter} from "next/navigation";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {checkIfCanApproveAction} from "@/helpers/stagingHelpers";

export default function ApproveEditUserRolesModal({stagingRecord, isOpen, onClose}: {
    stagingRecord: StagingResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const router = useRouter()
    const [canApprove, setCanApprove] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const {user} = useAuth();
    const [updateUserRolesRequest, setUpdateUserRolesRequest] = useState<UpdateUserRolesRequest>({} as UpdateUserRolesRequest);
    const [comment, setComment] = useState('');

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const jsonData = JSON.parse(stagingRecord.dataAfter);
        const userRequest: UpdateUserRolesRequest = {
            userId: jsonData.userId,
            userRoles: jsonData.userRoles
        };
        setUpdateUserRolesRequest(userRequest)
    }, []);


    useEffect(() => {
        async function checkPermissions() {
            const canApproveAction = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersApproveManageRoles)]);
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
        let response = await updateUserRoles(updateUserRolesRequest);
        if (response.statusCode === 200) {
            toast.success(response.message)
            setIsSubmitting(false);

            const stagingRequest: StagingUpsertRequest = {
                id: stagingRecord.id,
                entity: stagingRecord.entity,
                dataBefore: stagingRecord.dataBefore,
                dataAfter: stagingRecord.dataAfter,
                creator: user?.email,
                approverId: user?.id,
                action: stagingRecord.action,
                status: StagingRecordStatus.Completed,
                comments: comment
            };
            const upsertResponse = await upsertStagingRecord(stagingRequest);
            if (upsertResponse.statusCode === 200) {
                const auditRequest: AuditRecordRequest = {
                    auditType: AppAuditType.UpdateApproved,
                    module: ApplicationModule.Users,
                    comment: comment,
                    dataAfter:  stagingRecord.dataAfter,
                    dataBefore: stagingRecord.dataBefore,
                    description: `Approved update roles for user ${stagingRecord.entity}`,
                }
                await addAuditRecord(auditRequest);
                router.push("/dashboard/users")
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
            entity: stagingRecord.entity,
            dataBefore: stagingRecord.dataBefore,
            dataAfter: stagingRecord.dataAfter,
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsUsersManageRoles),
            status: StagingRecordStatus.Declined,
            comments: comment
        };
        const upsertResponse = await upsertStagingRecord(stagingRequest);
        if (upsertResponse.statusCode === 200) {
            setIsDeclining(false)
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateDeclined,
                module: ApplicationModule.Users,
                comment: comment,
                dataAfter:  stagingRecord.dataAfter,
                dataBefore: stagingRecord.dataBefore,
                description: `declined update roles for user ${stagingRecord.entity}`,
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
                size="3xl"
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Approve Update UserRoles</ModalHeader>

                            {updateUserRolesRequest && (<ModalBody>

                                    <h3>User Details</h3>

                                    <div className="grid gap-6 mb-1 md:grid-cols-1">
                                        <div className="mb-6">
                                            <label htmlFor="email"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                                                address</label>
                                            <input type="email" id="email"
                                                   value={stagingRecord.entity}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                         focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="john.doe@company.com" disabled={true}/>
                                        </div>

                                    </div>

                                    <h3>New Roles</h3>

                                    <table
                                        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead
                                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Role Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Status
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {updateUserRolesRequest.userRoles && updateUserRolesRequest.userRoles.map((item) => (
                                            <tr
                                                key={item.roleId}
                                                className={"dark:bg-gray-800"}
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.roleName}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.roleDescription}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <input defaultChecked={true} id="checked-checkbox" type="checkbox"
                                                           value=""
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600
                                                           dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                           readOnly={true}/>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
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
                                        <Button color="danger" onPress={handleDecline}>
                                            {isDeclining ? "Declining..." : "Decline"}
                                        </Button>
                                        <Button color="success" onPress={handleApprove}>
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

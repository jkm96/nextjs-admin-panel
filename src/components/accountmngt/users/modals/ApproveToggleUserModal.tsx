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
import {CreateUserRequest, ToggleUserStatusRequest, UpdateUserRequest, User} from "@/boundary/interfaces/user";
import {toast} from "react-toastify";
import {createUser, toggleUserStatus, updateUser} from "@/lib/services/accountmngt/userService";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {useRouter} from "next/navigation";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {checkIfCanApproveAction} from "@/helpers/stagingHelpers";

export default function ApproveToggleUserModal({stagingRecord, isOpen, onClose}: {
    stagingRecord: StagingResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const router = useRouter()
    const [canApprove, setCanApprove] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const {user} = useAuth();
    const [toggleUserRequest, setToggleUserRequest] = useState<ToggleUserStatusRequest>({} as ToggleUserStatusRequest);
    const [comment, setComment] = useState('');

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const jsonData = JSON.parse(stagingRecord.dataAfter);
        const userRequest: ToggleUserStatusRequest = {
            activateUser: jsonData.activateUser,
            email: jsonData.email,
            userId: jsonData.userId
        };
        setToggleUserRequest(userRequest)
    }, []);

    const activate = !toggleUserRequest.activateUser ? "Deactivate User" : "Activate User"

    useEffect(() => {
        async function checkPermissions() {
            let canApproveAction = false;
            if (stagingRecord.action === MapPermission(AdminPortalPermission.PermissionsUsersActivate)){
               canApproveAction = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersApproveActivate)]);
            }else if(stagingRecord.action === MapPermission(AdminPortalPermission.PermissionsUsersDeactivate)){
                canApproveAction = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersApproveDeactivate)]);
            }

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
        let response = await toggleUserStatus(toggleUserRequest);
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
                    description: `Approved ${activate} ${stagingRecord.entity}`,
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
            dataAfter: JSON.stringify({}),
            creator: user?.email,
            approverId: user?.id,
            action: stagingRecord.action,
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
                description: `declined ${activate} ${stagingRecord.entity}`,
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
                size="2xl"
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Approve {activate} Status</ModalHeader>

                            {toggleUserRequest && (<ModalBody>

                                    <div className="grid gap-6 mb-1 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="email"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                            <input type="text" id="email"
                                                   defaultValue={toggleUserRequest.email}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="John" disabled={true}/>
                                        </div>

                                        <div>
                                            <label htmlFor="last_name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Status</label>
                                            <input type="text" id="last_name"
                                                   value={!toggleUserRequest.activateUser ? "Active" : "Inactive"}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Doe" disabled={true}/>

                                        </div>

                                        <div>
                                            <label htmlFor="last_name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Status</label>
                                            <input type="text" id="last_name"
                                                   value={!toggleUserRequest.activateUser ? "Inactive" : "Active"}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Doe" disabled={true}/>
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

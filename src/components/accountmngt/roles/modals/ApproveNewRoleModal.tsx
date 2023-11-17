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
import {CreateUserRequest, User} from "@/boundary/interfaces/user";
import {toast} from "react-toastify";
import {createUser} from "@/lib/services/accountmngt/userService";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {useRouter} from "next/navigation";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {checkIfCanApproveAction} from "@/helpers/stagingHelpers";
import {CreateRoleRequest} from "@/boundary/interfaces/role";
import {createRole} from "@/lib/services/accountmngt/roleService";

export default function ApproveNewRoleModal({stagingRecord, isOpen, onClose}: {
    stagingRecord: StagingResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const router = useRouter()
    const [canApprove, setCanApprove] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const {user} = useAuth();
    const [createRoleRequest, setCreateRoleRequest] = useState<CreateRoleRequest>({} as CreateRoleRequest);
    const [comment, setComment] = useState('');

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const jsonData = JSON.parse(stagingRecord.dataAfter);
        const roleRequest: CreateRoleRequest = {
            description: jsonData.description,
            name: jsonData.name,
            roleClaims: jsonData.roleClaims
        };
        setCreateRoleRequest(roleRequest)
    }, []);

    useEffect(() => {
        async function checkPermissions() {
            const canApproveAction = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsRolesApproveCreate)]);
            const canApprove = checkIfCanApproveAction(user, canApproveAction, stagingRecord);
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
        let response = await createRole(createRoleRequest);
        if (response.statusCode === 200) {
            toast.success(response.message)
            setIsSubmitting(false);

            const stagingRequest: StagingUpsertRequest = {
                id: stagingRecord.id,
                entity: createRoleRequest.name,
                dataBefore: stagingRecord.dataBefore,
                dataAfter: stagingRecord.dataAfter,
                creator: user?.email,
                approverId: user?.id,
                action: MapPermission(AdminPortalPermission.PermissionsRolesCreate),
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
                    description: `approved creation of role ${createRoleRequest.name}`,
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
            entity: createRoleRequest.name,
            dataBefore: JSON.stringify({}),
            dataAfter: JSON.stringify({}),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsRolesCreate),
            status: StagingRecordStatus.Declined,
            comments: comment
        };
        const upsertResponse = await upsertStagingRecord(stagingRequest);
        if (upsertResponse.statusCode === 200) {
            setIsDeclining(false)
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.CreateDeclined,
                module: ApplicationModule.Roles,
                comment: comment,
                dataAfter: JSON.stringify({}),
                dataBefore: JSON.stringify({}),
                description: `declined creation of role ${createRoleRequest.name}`,
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

                            {createRoleRequest && (<ModalBody>

                                    <h3>Role Details</h3>

                                    <div className="grid gap-6 mb-1 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input type="text" id="name"
                                                   defaultValue={createRoleRequest.name}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="John" disabled={true}/>
                                        </div>

                                        <div>
                                            <label htmlFor="description"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                            <input type="text" id="description"
                                                   defaultValue={createRoleRequest.description}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Doe" disabled={true}/>
                                        </div>
                                    </div>

                                    <h3>Selected Permissions</h3>

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
                                                Action
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
                                        {createRoleRequest.roleClaims && createRoleRequest.roleClaims.map((item) => (
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
                                                    {item.action}
                                                </td>
                                                <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.description}
                                                </td>
                                                <td className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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

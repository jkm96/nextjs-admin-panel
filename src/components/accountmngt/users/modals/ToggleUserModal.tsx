import {ToggleUserStatusRequest} from "@/boundary/interfaces/user";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React, {useState} from "react";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {toast} from "react-toastify";
import {useAuth} from "@/hooks/useAuth";
import Spinner from "@/components/shared/icons/Spinner";

export default function ToggleUserModal({toggleUserStatusRequest, isOpen, onClose}: {
    toggleUserStatusRequest: ToggleUserStatusRequest,
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const activate = toggleUserStatusRequest.activateUser ? "Deactivate User" : "Activate User"
    const stagingAction = toggleUserStatusRequest.activateUser ?
        MapPermission(AdminPortalPermission.PermissionsUsersDeactivate)
        : MapPermission(AdminPortalPermission.PermissionsUsersActivate)

    const handleToggleUserSubmit = async (e: any) => {
        e.preventDefault()
        setIsSubmitting(true)

        const dataAfter: ToggleUserStatusRequest = {
            activateUser: !toggleUserStatusRequest.activateUser,
            email: toggleUserStatusRequest.email,
            userId: toggleUserStatusRequest.userId
        }
        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: toggleUserStatusRequest.email,
            dataBefore: JSON.stringify(toggleUserStatusRequest),
            dataAfter: JSON.stringify(dataAfter),
            creator: user?.email,
            approverId: user?.id,
            action: stagingAction,
            status: StagingRecordStatus.Pending,
            comments: `Request to ${activate} user`
        };

        let response = await upsertStagingRecord(stagingRequest);

        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateInitiated,
                module: ApplicationModule.Users,
                comment: "",
                dataBefore: JSON.stringify(toggleUserStatusRequest),
                dataAfter: JSON.stringify(dataAfter),
                description: `Initiated ${activate} ${toggleUserStatusRequest.email}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    }

    const handleCloseModal = () => {
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
                placement="top-center"
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{activate}</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleToggleUserSubmit}>
                                    <div className={"text-center"}>
                                        Are you sure you want to {activate} {toggleUserStatusRequest.email}?
                                    </div>
                                </form>
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
                                            onClick={handleToggleUserSubmit}
                                    >
                                        {isSubmitting ? "Submitting..." : activate}
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
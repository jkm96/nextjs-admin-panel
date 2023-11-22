import {UpdateRoleRequest} from "@/boundary/interfaces/role";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import PersonIcon from "@/components/shared/icons/PersonIcon";
import Spinner from "@/components/shared/icons/Spinner";
import React, {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {validateUpdateRoleFormInputErrors} from "@/helpers/validationHelpers";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";
import {toast} from "react-toastify";

export default function UpdateRoleModal({updateRoleRequest,isOpen, onClose}: {
    updateRoleRequest: UpdateRoleRequest,
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateRoleFormData, setUpdateRoleFormData] = useState<UpdateRoleRequest>(updateRoleRequest);
    const [inputErrors, setInputErrors] = useState({
        name: "", description: ""
    });

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setUpdateRoleFormData({...updateRoleFormData, [name]: value});
    }

    const handleRoleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true)

        const inputErrors = validateUpdateRoleFormInputErrors(updateRoleFormData);
        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            setIsSubmitting(false)
            return;
        }

        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: updateRoleRequest.name,
            dataBefore: JSON.stringify(updateRoleRequest),
            dataAfter: JSON.stringify(updateRoleFormData),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsRolesEdit),
            status: StagingRecordStatus.Pending,
            comments: "Request to update role data"
        };

        let response = await upsertStagingRecord(stagingRequest);

        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateInitiated,
                module: ApplicationModule.Roles,
                comment: "Request to update role data",
                dataBefore: JSON.stringify(updateRoleRequest),
                dataAfter: JSON.stringify(updateRoleFormData),
                description: `Initiated update of role ${updateRoleRequest.name}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            setUpdateRoleFormData(updateRoleRequest)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    };

    const handleCloseModal = () => {
        setIsSubmitting(false)
        setUpdateRoleFormData(updateRoleRequest)
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
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update User</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleRoleUpdateSubmit}>
                                    <div className="grid md:grid-cols-1 md:gap-6">
                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateRoleFormData.name}
                                               label="Name"
                                               name="name"
                                               variant={"bordered"}
                                               className="mt-2 mb-1 "
                                               placeholder="Enter name"
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, name: ""});
                                               }}
                                               isInvalid={inputErrors.name !== ""}
                                               errorMessage={inputErrors.name}/>

                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateRoleFormData.description}
                                               label="Description"
                                               name="description"
                                               variant={"bordered"}
                                               className="mt-2 mb-1 "
                                               placeholder="Enter lastName"
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, description: ""});
                                               }}
                                               isInvalid={inputErrors.description !== ""}
                                               errorMessage={inputErrors.description}/>
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
                                            onClick={handleRoleUpdateSubmit}
                                    >
                                        {isSubmitting ? "Submitting..." : "Update Role"}
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
import React, {useEffect, useState} from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table, TableBody, TableCell, TableColumn,
    useDisclosure, TableHeader, TableRow, Checkbox
} from "@nextui-org/react";
import {PlusIcon} from "@/components/shared/icons/PlusIcon";
import PersonIcon from "@/components/shared/icons/PersonIcon";
import {getRoles} from "@/lib/services/accountmngt/roleService";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {RoleResponse} from "@/boundary/interfaces/role";
import {validateCreateUserFormInputErrors, validateUpdateUserFormInputErrors} from "@/helpers/validationHelpers";
import {CreateUserRequest, UpdateUserRequest, UserRoleModel} from "@/boundary/interfaces/user";
import {MailIcon} from "@/components/shared/icons/MailIcon";
import {toast} from "react-toastify";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";

export default function UpdateUserModal({updateUserRequest, userEmail, isOpen, onClose}: {
    updateUserRequest: UpdateUserRequest,
    userEmail:string
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateUserFormData, setUpdateUserFormData] = useState<UpdateUserRequest>(updateUserRequest);
    const [inputErrors, setInputErrors] = useState({
        lastName: "", phoneNumber: "", firstName: "", userName: ""
    });

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setUpdateUserFormData({...updateUserFormData, [name]: value});
    }

    const handleUserUpdateSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true)

        const inputErrors = validateUpdateUserFormInputErrors(updateUserFormData);
        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            setIsSubmitting(false)
            return;
        }

        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: userEmail,
            dataBefore: JSON.stringify(updateUserRequest),
            dataAfter: JSON.stringify(updateUserFormData),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsUsersEdit),
            status: StagingRecordStatus.Pending,
            comments: "Request to update user data"
        };

        let response = await upsertStagingRecord(stagingRequest);

        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.UpdateInitiated,
                module: ApplicationModule.Users,
                comment: "",
                dataBefore: JSON.stringify(updateUserRequest),
                dataAfter: JSON.stringify(updateUserFormData),
                description: `Initiated update of user ${userEmail}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            setUpdateUserFormData(updateUserRequest)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    };

    const handleCloseModal = () => {
        setIsSubmitting(false)
        setUpdateUserFormData(updateUserRequest);
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
                size="5xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Update User</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleUserUpdateSubmit}>
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateUserFormData.firstName}
                                               label="FirstName"
                                               name="firstName"
                                               endContent={
                                                   <PersonIcon
                                                       className="fill-current"/>
                                               }
                                               variant={"bordered"}
                                               className="mt-2 mb-1 "
                                               placeholder="Enter firstName"
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, firstName: ""});
                                               }}
                                               isInvalid={inputErrors.firstName !== ""}
                                               errorMessage={inputErrors.firstName}/>

                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateUserFormData.lastName}
                                               label="Lastname"
                                               name="lastName"
                                               endContent={
                                                   <PersonIcon
                                                       className="fill-current"/>
                                               }
                                               variant={"bordered"}
                                               className="mt-2 mb-1 "
                                               placeholder="Enter lastName"
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, lastName: ""});
                                               }}
                                               isInvalid={inputErrors.lastName !== ""}
                                               errorMessage={inputErrors.lastName}/>
                                    </div>

                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateUserFormData.userName}
                                               label="Username"
                                               name="userName"
                                               className="mt-2 mb-1 "
                                               variant={"bordered"}
                                               placeholder="Enter username"
                                               endContent={
                                                   <PersonIcon
                                                       className="fill-current"/>
                                               }
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, userName: ""});
                                               }}
                                               isInvalid={inputErrors.userName !== ""}
                                               errorMessage={inputErrors.userName}/>

                                        <Input type="text"
                                               onChange={handleChange}
                                               value={updateUserFormData.phoneNumber}
                                               label="PhoneNumber"
                                               name="phoneNumber"
                                               endContent={
                                                   <PersonIcon
                                                       className="fill-current"/>
                                               }
                                               variant={"bordered"}
                                               className="mt-2 mb-1 "
                                               placeholder="Enter phone number"
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, phoneNumber: ""});
                                               }}
                                               isInvalid={inputErrors.phoneNumber !== ""}
                                               errorMessage={inputErrors.phoneNumber}/>
                                    </div>

                                    <div className="flex justify-end mt-4 gap-1">
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary"
                                                type="submit"
                                                onClick={handleUserUpdateSubmit}
                                        >
                                            {isSubmitting ? "Submitting..." : "Update User"}
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

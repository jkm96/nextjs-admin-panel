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
import {validateCreateUserFormInputErrors} from "@/helpers/validationHelpers";
import {CreateUserRequest, UserRoleModel} from "@/boundary/interfaces/user";
import {MailIcon} from "@/components/shared/icons/MailIcon";
import {toast} from "react-toastify";
import {upsertStagingRecord} from "@/lib/services/staging/stagingRecordService";
import {StagingRecordStatus, StagingUpsertRequest} from "@/boundary/interfaces/staging";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";

const initialFormState: CreateUserRequest = {
    phoneNumber: "",
    email: "", lastName: "",
    firstName: "", userName: "",
    userRolesList: []
};
export default function CreateUserModal({isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [roleList, setRoleList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendError, setBackendError] = useState("");
    const [createUserFormData, setCreateUserFormData] = useState<CreateUserRequest>(initialFormState);
    const [inputErrors, setInputErrors] = useState({
        email: "", lastName: "",phoneNumber: "",
        firstName: "", userName: ""
    });

    useEffect(() => {
        if (isOpen) {
            const queryParams = new RoleQueryParameters();
            getRoles(queryParams)
                .then((response) => {
                    if (response.statusCode === 200) {
                        const parsedData = response.data;
                        const {data} = parsedData;

                        const mappedRoles = data.map((role: any) => ({
                            roleName: role.name,
                            roleId: role.id,
                            roleDescription: role.description,
                            selected: false,
                        }));

                        setCreateUserFormData({
                            ...createUserFormData,
                            userRolesList: mappedRoles,
                        });
                        setRoleList(data)
                    }
                })
                .catch((error) => {
                    console.error(`Error fetching roles: ${error}`);
                });
        }
    }, [isOpen]);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setCreateUserFormData({...createUserFormData, [name]: value});
    }

    const handleRoleCheckboxChange = (roleName: string, checked: boolean) => {
        const updatedRoles = createUserFormData.userRolesList.map((role) =>
            role.roleName === roleName ? {...role, selected: checked} : role
        );

        setCreateUserFormData({
            ...createUserFormData,
            userRolesList: updatedRoles,
        });
    };

    const handleUserCreationSubmit = async (e: any) => {
        e.preventDefault();
        setBackendError("");
        setIsSubmitting(true)

        const inputErrors = validateCreateUserFormInputErrors(createUserFormData);
        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            setIsSubmitting(false)
            return;
        }

        if (
            createUserFormData.email.trim() === "" ||
            createUserFormData.userName.trim() === "" ||
            createUserFormData.firstName.trim() === "" ||
            createUserFormData.lastName.trim() === ""||
            createUserFormData.phoneNumber.trim() === ""
        ) {
            setIsSubmitting(false)
            return;
        }

        if (!createUserFormData.userRolesList.some((role) => role.selected)) {
            setIsSubmitting(false);
            toast.error("Please select at least one role.");
            return;
        }

        const selectedRoles = createUserFormData
            .userRolesList
            .filter((role) => role.selected);

        const dataAfter = {
            ...createUserFormData,
            userRolesList: selectedRoles,
        };
        const stagingRequest: StagingUpsertRequest = {
            id: 0,
            entity: createUserFormData.email,
            dataBefore: JSON.stringify(initialFormState),
            dataAfter: JSON.stringify(dataAfter),
            creator: user?.email,
            approverId: user?.id,
            action: MapPermission(AdminPortalPermission.PermissionsUsersCreate),
            status: StagingRecordStatus.Pending,
            comments: "Request to add new user data"
        };

        let response = await upsertStagingRecord(stagingRequest);

        if (response.statusCode === 200) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.CreateInitiated,
                module: ApplicationModule.Users,
                comment: "",
                dataAfter:  JSON.stringify(dataAfter),
                dataBefore: JSON.stringify(dataAfter),
                description: `Initiated creation of user ${createUserFormData.email}`,
            }
            await addAuditRecord(auditRequest);
            toast.success(response.message)
            setIsSubmitting(false)
            setCreateUserFormData(initialFormState)
            onClose();
        } else {
            setIsSubmitting(false)
            toast.error(response.message ?? "Unknown error occurred")
        }
    };

    const handleCloseModal = () => {
        setCreateUserFormData(initialFormState);
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
                            <ModalHeader className="flex flex-col gap-1">Create User</ModalHeader>
                            <ModalBody>
                                <h3>User Details</h3>
                                <form onSubmit={handleUserCreationSubmit}>
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <Input type="email"
                                               className="mt-2 mb-1 "
                                               onChange={handleChange}
                                               value={createUserFormData.email}
                                               label="Email"
                                               name="email"
                                               variant={"bordered"}
                                               placeholder="Enter your email"
                                               endContent={
                                                   <MailIcon
                                                       className="fill-current"/>
                                               }
                                               onInput={() => {
                                                   setInputErrors({...inputErrors, email: ""});
                                               }}
                                               isInvalid={inputErrors.email !== ""}
                                               errorMessage={inputErrors.email}/>

                                        <Input type="text"
                                               onChange={handleChange}
                                               value={createUserFormData.userName}
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
                                    </div>

                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <Input type="text"
                                               onChange={handleChange}
                                               value={createUserFormData.firstName}
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
                                               value={createUserFormData.lastName}
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
                                               value={createUserFormData.phoneNumber}
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

                                    <h3>Roles</h3>
                                    <Table aria-label="Example table with dynamic content"
                                    >
                                        <TableHeader>
                                            <TableColumn>Name</TableColumn>
                                            <TableColumn>Description</TableColumn>
                                            <TableColumn>Action</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {roleList.map((item: RoleResponse) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.description}</TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={
                                                                createUserFormData.userRolesList.some(
                                                                    (role) => role.roleName === item.name && role.selected
                                                                )
                                                            }
                                                            onChange={(e) =>
                                                                handleRoleCheckboxChange(item.name, e.target.checked)
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
                                    <div className="flex justify-end mt-4 gap-1">
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary"
                                                type="submit"
                                                onClick={handleUserCreationSubmit}
                                        >
                                            {isSubmitting ? "Submitting..." : "Create User"}
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

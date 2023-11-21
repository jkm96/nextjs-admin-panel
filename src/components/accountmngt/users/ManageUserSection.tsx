import React, {useEffect, useState} from "react";
import {getUserById, getUserRoles} from "@/lib/services/accountmngt/userService";
import {toast} from "react-toastify";
import {
    Button,
    Checkbox, Chip, CircularProgress,
    Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow
} from "@nextui-org/react";
import PersonIcon from "@/components/shared/icons/PersonIcon";
import {ToggleUserStatusRequest, UpdateUserRequest, UserResponse} from "@/boundary/interfaces/user";
import {MailIcon} from "@/components/shared/icons/MailIcon";
import {CheckIcon} from "@/components/shared/icons/CheckIcon";
import {CrossIcon} from "@/components/shared/icons/CrossIcon";
import {RoleResponse} from "@/boundary/interfaces/role";
import ManageUserRolesModal from "@/components/accountmngt/users/modals/ManageUserRolesModal";
import UpdateUserModal from "@/components/accountmngt/users/modals/UpdateUserModal";
import ToggleUserModal from "@/components/accountmngt/users/modals/ToggleUserModal";
import {useAuth} from "@/hooks/useAuth";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";

const initialUserData: UserResponse = {
    changePasswordOnLogin: false,
    createdOn: new Date(),
    email: "",
    emailConfirmed: "",
    enableEmailOtp: false,
    enableSmsOtp: false,
    firstName: "",
    id: "",
    isActive: "",
    isDeleted: false,
    lastName: "",
    phoneNumber: "",
    profilePictureDataUrl: "",
    userName: ""
}
export default function ManageUserSection({userId}: { userId: string }) {
    const {user} = useAuth();
    const [userPermissions, setUserPermissions] = useState({
        canEditUser: false,
        canManageUserRoles: false,
        canToggleUser: false,
    });
    const [userDetails, setUserDetails] = useState<UserResponse>(initialUserData);
    const [userRoleList, setUserRoleList] = useState<RoleResponse[]>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const isActive = userDetails.isActive === 'active';
    const isEmailConfirmed = userDetails.emailConfirmed === 'confirmed';
    const [modals, setModals] = useState({
        updateUserRoles: false,
        updateUser: false,
        toggleUser: false,
        resendEmailConfirmation: false,
    });

    useEffect(() => {
        async function checkPermission() {
            const canEditUser = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersEdit)]);
            const canManageUserRoles = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersManageRoles)]);
            const canToggleUser = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersToggleStatus)]);
            setUserPermissions({
                canEditUser,
                canManageUserRoles,
                canToggleUser
            });
        }

        checkPermission();
    }, []);

    const openModal = (modalName: string) => {
        setModals({...modals, [modalName]: true});
    };

    const closeModal = (modalName: string) => {
        setModals({...modals, [modalName]: false});
    };

    const fetchUserDetails = async (userId: string) => {
        setIsLoadingUser(true);
        try {
            const response = await getUserById(userId);
            if (response.statusCode === 200) {
                setUserDetails(response.data);
            }
        } catch (error) {
            toast.error(`Error fetching user details: ${error}`);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchUserDetails(userId);
    }, [userId]);

    useEffect(() => {
        setIsLoadingRoles(true)
        getUserRoles(userId)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    setUserRoleList(parsedData)
                }
            })
            .catch((error) => {
                toast.error(`Error fetching roles: ${error}`);
            })
            .finally(() => {
                setIsLoadingRoles(false);
            });
    }, [userId]);

    const updateUserRequest: UpdateUserRequest = {
        userId: userDetails.id,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phoneNumber: userDetails.phoneNumber,
        userName: userDetails.userName
    }
    const toggleUserStatusRequest: ToggleUserStatusRequest = {
        activateUser: isActive,
        email: userDetails.email,
        userId: userDetails.id
    }

    return (
        <>
            {!isLoadingUser && !isLoadingRoles && (
                <>
                    {user?.email !== userDetails.email && (
                        <>
                            <h3>Actions</h3>

                            <div className="grid md:grid-cols-4 md:gap-4 mb-2">

                                {userPermissions.canEditUser && (
                                    <>
                                        <Button onPress={() => openModal("updateUser")} color="primary"
                                                variant="shadow">
                                            Edit User
                                        </Button>
                                        <UpdateUserModal
                                            updateUserRequest={updateUserRequest}
                                            userEmail={userDetails.email}
                                            isOpen={modals.updateUser}
                                            onClose={() => closeModal("updateUser")}
                                        />
                                    </>
                                )}

                                {userPermissions.canManageUserRoles && (
                                    <>
                                        <Button onPress={() => openModal("updateUserRoles")} color="primary"
                                                variant="shadow">
                                            Update Roles
                                        </Button>
                                        <ManageUserRolesModal
                                            userCurrentRoles={userRoleList}
                                            userDetails={userDetails}
                                            isOpen={modals.updateUserRoles}
                                            onClose={() => closeModal("updateUserRoles")}
                                        />
                                    </>
                                )}

                                {userPermissions.canToggleUser && (
                                    <>
                                        <Button
                                            onPress={() => openModal("toggleUser")}
                                            color={isActive ? 'danger' : 'primary'}
                                            variant="shadow">
                                            {isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <ToggleUserModal
                                            toggleUserStatusRequest={toggleUserStatusRequest}
                                            isOpen={modals.toggleUser}
                                            onClose={() => closeModal("toggleUser")}
                                        />
                                    </>
                                )}

                            </div>
                        </>
                    )}
                </>
            )}

            {isLoadingUser ? (
                <div className={"grid place-items-center"}>
                    <CircularProgress color={"primary"} className={"p-4"} label="Loading user details...."/>
                </div>
            ) : (
                <>
                    <h3>User Details</h3>

                    <div className="grid md:grid-cols-3 md:gap-4">
                        <Input type="email"
                               className="mt-2 mb-1 "
                               defaultValue={userDetails.email}
                               label="Email"
                               endContent={
                                   <MailIcon
                                       className="fill-current"/>
                               }
                               readOnly={true}
                               variant={"bordered"}
                        />

                        <Input type="email"
                               className="mt-2 mb-1 "
                               defaultValue={userDetails.createdOn.toString()}
                               label="Created On"
                               endContent={
                                   <PersonIcon
                                       className="fill-current"/>
                               }
                               readOnly={true}
                               variant={"bordered"}
                        />

                        <Input type="text"
                               defaultValue={userDetails.userName}
                               label="Username"
                               name="userName"
                               className="mt-2 mb-1 "
                               variant={"bordered"}
                               endContent={
                                   <PersonIcon
                                       className="fill-current"/>
                               }/>
                    </div>

                    <div className="grid md:grid-cols-3 md:gap-4">
                        <Input type="text"
                               defaultValue={userDetails.firstName}
                               label="FirstName"
                               name="firstName"
                               endContent={
                                   <PersonIcon
                                       className="fill-current"/>
                               }
                               variant={"bordered"}
                               className="mt-2 mb-1 "/>

                        <Input type="text"
                               defaultValue={userDetails.lastName}
                               label="Lastname"
                               name="lastName"
                               endContent={
                                   <PersonIcon
                                       className="fill-current"/>
                               }
                               variant={"bordered"}
                               className="mt-2 mb-1 "/>

                        <Input type="text"
                               defaultValue={userDetails.phoneNumber ?? ""}
                               label="PhoneNumber"
                               name="phoneNumber"
                               endContent={
                                   <PersonIcon
                                       className="fill-current"/>
                               }
                               variant={"bordered"}
                               className="mt-2 mb-1 "/>
                    </div>

                    <h3 className="mt-4">User Status</h3>

                    <div className="flex gap-4 py-4 mt-2">
                        <Chip
                            startContent={isActive ? <CheckIcon size={18}/> : <CrossIcon size={18}/>}
                            variant="light"
                            color={isActive ? 'success' : 'danger'}
                        >
                            Active Status
                        </Chip>

                        <Chip
                            startContent={isEmailConfirmed ? <CheckIcon size={18}/> : <CrossIcon size={18}/>}
                            variant="light"
                            color={isEmailConfirmed ? 'success' : 'danger'}
                        >
                            Email Confirmed
                        </Chip>

                        <Chip
                            startContent={userDetails.enableSmsOtp ? <CheckIcon size={18}/> :
                                <CrossIcon size={18}/>}
                            variant="light"
                            color={userDetails.enableSmsOtp ? 'success' : 'danger'}
                        >
                            SmsOtp Enabled
                        </Chip>

                        <Chip
                            startContent={userDetails.enableEmailOtp ? <CheckIcon size={18}/> :
                                <CrossIcon size={18}/>}
                            variant="light"
                            color={userDetails.enableEmailOtp ? 'success' : 'danger'}
                        >
                            EmailOtp Enabled
                        </Chip>
                    </div>
                </>
            )}

            {isLoadingRoles ? (
                <div className={"grid place-items-center"}>
                    <CircularProgress color={"primary"} className={"p-4"} label="Loading user roles...."/>
                </div>
            ) : (
                <>
                    <h3 className={"mt-2"}>User Roles</h3>

                    <Table
                        className={"mt-2"}
                        aria-label="Example table with dynamic content">
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Description</TableColumn>
                            <TableColumn>CreatedOn</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {userRoleList.map((item: RoleResponse) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.createdOn.toString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
        </>
    );
}

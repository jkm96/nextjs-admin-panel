import React, {useEffect, useState} from "react";
import {ToggleUserStatusRequest, UpdateUserRequest, UserResponse} from "@/boundary/interfaces/user";
import {RoleResponse} from "@/boundary/interfaces/role";
import {toast} from "react-toastify";
import {Button, Chip, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {getRoleById, getRoleUsers} from "@/lib/services/accountmngt/roleService";

export default function ManageRoleSection({roleId}: { roleId: string }) {
    const [roleDetails, setRoleDetails] = useState<RoleResponse>({} as RoleResponse);
    const [roleUsersList, setRoleUsersList] = useState<UserResponse[]>([]);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [isLoadingRoleUsers, setIsLoadingRoleUsers] = useState(true);

    const [modals, setModals] = useState({
        updateUserRoles: false,
        updateUser: false,
        toggleUser: false,
        resendEmailConfirmation: false,
    });

    const openModal = (modalName: string) => {
        setModals({ ...modals, [modalName]: true });
    };

    const closeModal = (modalName: string) => {
        setModals({ ...modals, [modalName]: false });
    };
    const fetchRoleDetails = async (roleId: string) => {
        setIsLoadingRole(true);
        try {
            const response = await getRoleById(roleId);
            if (response.statusCode === 200) {
                setRoleDetails(response.data);
            }else{
                toast.error(`Error fetching role details ${response.message}`)
            }
        } catch (error) {
            toast.error(`Error fetching role details: ${error}`);
        } finally {
            setIsLoadingRole(false);
        }
    };

    useEffect(() => {
        fetchRoleDetails(roleId);
    }, [roleId]);

    useEffect(() => {
        setIsLoadingRoleUsers(true)
        getRoleUsers(roleId)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    setRoleUsersList(parsedData)
                }else{
                    toast.error(`Error fetching role users ${response.message}`)
                }
            })
            .catch((error) => {
                toast.error(`Error fetching role users: ${error}`);
            })
            .finally(() => {
                setIsLoadingRoleUsers(false);
            });
    }, [roleId]);


    return (
        <>
            {!isLoadingRole && !isLoadingRoleUsers && (
                <>
                    <h3>Actions</h3>

                    <div className="grid md:grid-cols-4 md:gap-4 mb-2">

                        <Button onPress={() => openModal("updateUser")} color="primary" variant="shadow">
                            Edit Role
                        </Button>
                        {/*<UpdateUserModal*/}
                        {/*    // updateUserRequest={updateUserRequest}*/}
                        {/*    // userEmail={roleDetails.email}*/}
                        {/*    isOpen={modals.updateUser}*/}
                        {/*    onClose={() => closeModal("updateUser")}*/}
                        {/*/>*/}

                        {/*<Button*/}
                        {/*    onPress={() => openModal("toggleUser")}*/}
                        {/*    color={isActive ? 'danger' : 'primary'}*/}
                        {/*    variant="shadow">*/}
                        {/*    {isActive ? 'Deactivate' : 'Activate'}*/}
                        {/*</Button>*/}
                        {/*<ToggleUserModal*/}
                        {/*    toggleUserStatusRequest={toggleUserStatusRequest}*/}
                        {/*    isOpen={modals.toggleUser}*/}
                        {/*    onClose={() => closeModal("toggleUser")}*/}
                        {/*/>*/}

                    </div>
                </>
            )}

            {isLoadingRole ? (
                <div className={"text-center"}>
                    <p>Loading role details...</p>
                </div>
            ) : (
                <>
                    <h3>Role Details</h3>

                    <div className="grid md:grid-cols-2 md:gap-4">
                        <Input type="text"
                               className="mt-2 mb-1 "
                               value={roleDetails.name}
                               label="Name"
                               readOnly={true}
                               variant={"bordered"}
                        />

                        <Input type="text"
                               value={roleDetails.description}
                               label="Description"
                               className="mt-2 mb-1 "
                               variant={"bordered"}
                           />
                    </div>
                </>
            )}

            {isLoadingRoleUsers ? (
                <div className={"text-center"}>
                    <p>Loading role users...</p>
                </div>
            ) : (
                <>
                    <h3 className={"mt-2"}>Users In Role</h3>

                    <Table
                        className={"mt-2"}
                        aria-label="Example table with dynamic content">
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Email</TableColumn>
                            <TableColumn>CreatedOn</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {roleUsersList.map((item: UserResponse) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.firstName} {item.lastName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
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
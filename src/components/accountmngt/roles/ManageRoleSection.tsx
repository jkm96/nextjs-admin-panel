import React, {useEffect, useState} from "react";
import {ToggleUserStatusRequest, UpdateUserRequest, UserResponse} from "@/boundary/interfaces/user";
import {RoleResponse, UpdateRoleRequest} from "@/boundary/interfaces/role";
import {toast} from "react-toastify";
import {
    Button,
    Chip,
    CircularProgress,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {getRoleById, getRolePermissions, getRoleUsers} from "@/lib/services/accountmngt/roleService";
import {Permission} from "@/boundary/interfaces/permission";
import {groupPermissionsByGroup} from "@/helpers/permissionsHelper";
import {Badge} from "@nextui-org/badge";
import UpdateRoleModal from "@/components/accountmngt/roles/modals/UpdateRoleModal";

export default function ManageRoleSection({roleId}: { roleId: string }) {
    const [roleDetails, setRoleDetails] = useState<RoleResponse>({} as RoleResponse);
    const [roleUsersList, setRoleUsersList] = useState<UserResponse[]>([]);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [isLoadingRoleUsers, setIsLoadingRoleUsers] = useState(true);
    const [isLoadingRolePermissions, setIsLoadingRolePermissions] = useState(true);

    const [modals, setModals] = useState({
        updateRole: false,
        toggleRole: false,
    });

    const openModal = (modalName: string) => {
        setModals({...modals, [modalName]: true});
    };

    const closeModal = (modalName: string) => {
        setModals({...modals, [modalName]: false});
    };
    const fetchRoleDetails = async (roleId: string) => {
        setIsLoadingRole(true);
        try {
            const response = await getRoleById(roleId);
            if (response.statusCode === 200) {
                setRoleDetails(response.data);
            } else {
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
                } else {
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

    const fetchRolePermissions = async (roleId: string) => {
        setIsLoadingRolePermissions(true);
        try {
            const response = await getRolePermissions(roleId);
            if (response.statusCode === 200) {
                const rolePermissions: Permission[] = response.data.roleClaims;
                const groupedPermissions = groupPermissionsByGroup(rolePermissions);
                setGroupedPermissions(groupedPermissions);
            } else {
                toast.error(`Error fetching role permissions ${response.message}`)
            }
        } catch (error) {
            toast.error(`Error fetching role permissions: ${error}`);
        } finally {
            setIsLoadingRolePermissions(false);
        }
    };

    useEffect(() => {
        fetchRolePermissions(roleId);
    }, [roleId]);

    const updateRoleRequest:UpdateRoleRequest =  {
        description: "",
        name: "",
        roleId: ""
    }


    return (
        <>
            {!isLoadingRole && !isLoadingRoleUsers && (
                <>
                    <h3>Actions</h3>

                    <div className="grid md:grid-cols-4 md:gap-4 mb-2">

                        <Button onPress={() => openModal("updateRole")} color="primary" variant="shadow">
                            Edit Role
                        </Button>
                        <UpdateRoleModal
                            updateRoleRequest={updateRoleRequest}
                            isOpen={modals.updateRole}
                            onClose={() => closeModal("updateRole")}
                        />

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
                <div className={"grid place-items-center"}>
                    <CircularProgress color={"primary"} className={"p-4"} label="Loading role details...." />
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
                <div className={"grid place-items-center"}>
                    <CircularProgress color={"primary"} className={"p-4"} label="Loading role users...." />
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

            {isLoadingRolePermissions ? (
                <div className={"grid place-items-center"}>
                    <CircularProgress color={"primary"} className={"p-4"} label="Loading role permissions...." />
                </div>
            ) : (
               <>
                   <h3 className="mt-4">Role Permissions</h3>

                   <div className="grid md:grid-cols-1 md:gap-6">
                       {Object.entries(groupedPermissions).map(([group, permissions]) => (
                           <div key={group}>

                                   <h2 className="mt-1">
                                       {group}
                                       <Chip color="primary">{permissions.length}</Chip>
                                   </h2>

                               <Table
                                   className={"mt-2"}
                                   aria-label="permissions-table">
                                   <TableHeader>
                                       <TableColumn>Value</TableColumn>
                                       <TableColumn>Type</TableColumn>
                                       <TableColumn>Action</TableColumn>
                                       <TableColumn>Description</TableColumn>
                                   </TableHeader>
                                   <TableBody>
                                       {permissions.map((permission: Permission) => (
                                           <TableRow key={permission.value}>
                                               <TableCell>{permission.value}</TableCell>
                                               <TableCell>{permission.type}</TableCell>
                                               <TableCell>{permission.action}</TableCell>
                                               <TableCell>{permission.description}</TableCell>
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </div>
                       ))}
                   </div>
               </>
            )}
        </>
    );
}
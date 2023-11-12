import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
    Input,
    Link
} from "@nextui-org/react";
import {StagingResponse} from "@/boundary/interfaces/staging";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {useAuth} from "@/hooks/useAuth";
import {CreateUserRequest} from "@/boundary/interfaces/user";

export default function ApproveNewUserModal({stagingRecord, isOpen, onClose}: {
    stagingRecord: StagingResponse,
    isOpen: boolean,
    onClose: () => void
}) {
    const {user} = useAuth();
    const [createUserRequest, setCreateUserRequest] = useState<CreateUserRequest>({} as CreateUserRequest);

    useEffect(() => {
        const jsonData = JSON.parse(stagingRecord.dataAfter);
        console.log("parsed data", jsonData)
        const userRequest: CreateUserRequest = {
            email: jsonData.email,
            firstName: jsonData.firstName,
            lastName: jsonData.lastName,
            userName: jsonData.userName,
            userRolesList: jsonData.userRolesList
        };
        setCreateUserRequest(userRequest)
    }, []);


    useEffect(() => {
        async function checkPermissions() {
            const canApprove = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersApprove)]);
            console.log("can approve", canApprove)
        }

        checkPermissions();
    }, []);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => onClose()}
                onClose={onClose}
                size="4xl"
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Approve New User</ModalHeader>

                            {createUserRequest && (<ModalBody>

                                    <h3>User Details</h3>

                                    <div className="grid gap-6 mb-1 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="first_name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                                                name</label>
                                            <input type="text" id="first_name"
                                                   defaultValue={createUserRequest.firstName}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="John" disabled={true}/>
                                        </div>

                                        <div>
                                            <label htmlFor="last_name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                                                name</label>
                                            <input type="text" id="last_name"
                                                   defaultValue={createUserRequest.lastName}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Doe" disabled={true}/>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="email"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                                                address</label>
                                            <input type="email" id="email"
                                                   defaultValue={createUserRequest.email}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                         focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="john.doe@company.com" disabled={true}/>
                                        </div>

                                        <div>
                                            <label htmlFor="last_name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                            <input type="text" id="last_name"
                                                   defaultValue={createUserRequest.userName}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Doe" disabled={true}/>
                                        </div>
                                    </div>

                                    <h3>Selected Roles</h3>

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
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {createUserRequest.userRolesList && createUserRequest.userRolesList.map((item) => (
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
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                </ModalBody>
                            )}
                            <ModalFooter>
                                <Button color="danger" variant="flat">
                                    Decline
                                </Button>
                                <Button color="success" onPress={onClose}>
                                    Approve
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

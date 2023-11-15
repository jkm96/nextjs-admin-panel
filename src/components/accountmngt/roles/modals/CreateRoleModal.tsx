import React, {useEffect, useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import {getRegisteredPermissions} from "@/lib/services/accountmngt/roleService";
import {toast} from "react-toastify";
import {Permission} from "@/boundary/interfaces/permission";
import {groupPermissionsByGroup} from "@/helpers/permissionsHelper";

export default function CreateRoleModal({isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void
}) {
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const fetchPermissions = async () => {
        await getRegisteredPermissions()
            .then((response) => {
                if (response.statusCode === 200) {
                    const permissionData = response.data;
                    console.log("permissionData", permissionData)

                    const permissions: Permission[] = permissionData;

                    const groupedPermissions = groupPermissionsByGroup(permissions);

                    console.log("groupedPermissions",groupedPermissions);
                    setGroupedPermissions(groupedPermissions);
                }
            })
            .catch((error) => {
                toast.error(`Error fetching permissions: ${error}`)
            })
    }
    useEffect(() => {
        if (isOpen){
            fetchPermissions();
        }
    }, [isOpen]);

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
                            <ModalHeader className="flex flex-col gap-1">Create Role</ModalHeader>
                            <ModalBody>
                                {Object.entries(groupedPermissions).map(([group, permissions]) => (
                                    <div key={group}>
                                        <h2>{group}</h2>
                                        <ul>
                                            {permissions.map((permission) => (
                                                <li key={permission.value}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            // Include your logic to determine if the checkbox is checked
                                                        />
                                                        {permission.description}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

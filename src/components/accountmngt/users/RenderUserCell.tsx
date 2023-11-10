import {UserResponse} from "@/boundary/interfaces/user";
import {Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import React from "react";

export default function RenderUserCell(user: UserResponse, columnKey: string | number | bigint, statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>) {
    // @ts-ignore
    const cellValue = user[columnKey];
    switch (columnKey) {
        case "email":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                </div>
            );
        case "name":
            return (
                <User
                    className="text-bold text-small capitalize"
                    name={user.firstName + ' ' + user.lastName}
                />
            );
        case "status":
            return (
                <Chip className="capitalize" color={statusColorMap[user.isActive]} size="sm" variant="flat">
                    {user.isActive}
                </Chip>
            );
        case "emailConfirmed":
            return (
                <Chip className="capitalize" color={statusColorMap[user.emailConfirmed]} size="sm" variant="flat">
                    {user.emailConfirmed}
                </Chip>
            );
        case "actions":
            return (
                <div className="relative flex justify-center items-center gap-2">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <VerticalDotsIcon className="text-default-300"/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>View</DropdownItem>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Delete</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        default:
            return cellValue;
    }
}

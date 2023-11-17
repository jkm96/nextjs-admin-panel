import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import React from "react";
import {RoleResponse} from "@/boundary/interfaces/role";

export default function RenderRoleCell(role: RoleResponse, columnKey: string | number | bigint) {
    // @ts-ignore
    const cellValue = role[columnKey];
    switch (columnKey) {
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

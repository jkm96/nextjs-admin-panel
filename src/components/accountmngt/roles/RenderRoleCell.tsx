import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import React from "react";
import {RoleResponse} from "@/boundary/interfaces/role";
import Link from "next/link";

export default function RenderRoleCell(role: RoleResponse, columnKey: string | number | bigint) {
    // @ts-ignore
    const cellValue = role[columnKey];
    if (columnKey === "actions" && role.name.toLowerCase() === "administrator") {
        // Don't render actions for the "Administrator" role
        return null;
    }

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
                            <DropdownItem>
                                <Link href={`/dashboard/roles/${role.id}`}>Manage</Link>
                            </DropdownItem>
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

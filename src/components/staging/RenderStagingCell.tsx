import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import React from "react";
import {StagingResponse} from "@/boundary/interfaces/staging";

export default function RenderStagingCell(stagingRecord: StagingResponse, columnKey: string | number | bigint) {
    // @ts-ignore
    const cellValue = stagingRecord[columnKey];
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

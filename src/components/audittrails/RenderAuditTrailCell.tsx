import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import React from "react";
import {AuditRecordResponse} from "@/boundary/interfaces/audit";

export default function RenderAuditTrailCell(auditRecord: AuditRecordResponse, columnKey: string | number | bigint, statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>) {
    // @ts-ignore
    const cellValue = auditRecord[columnKey];
    switch (columnKey) {
        case "description":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{auditRecord.creatorName} {auditRecord.description}</p>
                </div>
            )
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

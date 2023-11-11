import React from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ChevronDownIcon } from "@/components/shared/icons/ChevronDownIcon";
import { capitalize } from "@/lib/utils/tableUtils";

interface VisibleColumnsProps {
    visibleColumns: "all" | Set<React.Key>;
    setVisibleColumns: (value: (((prevState: ("all" | Set<React.Key>)) => ("all" | Set<React.Key>)) | "all" | Set<React.Key>)) => void;
    tableColumns: { uid: React.Key; name: string }[];
}

export function TableVisibleColumns({ visibleColumns, setVisibleColumns, tableColumns }: VisibleColumnsProps) {
    return (
        <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                    Columns
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
            >
                {tableColumns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                        {capitalize(column.name)}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

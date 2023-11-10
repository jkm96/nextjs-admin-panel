import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {ChevronDownIcon} from "@/components/shared/icons/ChevronDownIcon";
import {capitalize, roleTableColumns} from "@/lib/utils/tableUtils";

export function RoleVisibleColumns(visibleColumns: "all" | Set<React.Key>, setVisibleColumns: (value: (((prevState: ("all" | Set<React.Key>)) => ("all" | Set<React.Key>)) | "all" | Set<React.Key>)) => void) {
    return (
        <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                    Columns
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}>
                {roleTableColumns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                        {capitalize(column.name)}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}
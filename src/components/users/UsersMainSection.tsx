import React, {useState, useEffect} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Button,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    SortDescriptor,
    Selection,
    User,
    Chip, ChipProps,
} from "@nextui-org/react";
import {getUsers} from "@/lib/users/userService";
import {UserResponse} from "@/boundary/interfaces/user";
import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";
import {SearchIcon} from "@/components/shared/icons/SearchIcon";
import {ChevronDownIcon} from "@/components/shared/icons/ChevronDownIcon";
import {capitalize, statusOptions, userTableColumns} from "@/lib/utils/tableUtils";
import {PlusIcon} from "@/components/shared/icons/PlusIcon";
import {VerticalDotsIcon} from "@/components/shared/icons/VerticalDotsIcon";
import {toast} from "react-toastify";
import isActive = toast.isActive;
import {className} from "postcss-selector-parser";

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "status", "actions"];
export default function UsersMainSection() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });
    const statusColorMap: Record<string, ChipProps["color"]> = {
        active: "success",
        inactive: "danger",
        confirmed: "success",
        unconfirmed: "warning",
    };
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return userTableColumns;
        return userTableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    /**
     * fetch user data from api
     * @param queryParams
     */
    const fetchUsers = (queryParams: UserQueryParameters) => {
        getUsers(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    console.log("paging metadata", pagingMetaData)
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setUserList(data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching users: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: UserQueryParameters = new UserQueryParameters();
        queryParams.pageNumber = currentPage;
        fetchUsers(queryParams);
    }, [currentPage]);

    /***
     *sorting data
     **/
    const sortedItems = React.useMemo(() => {
        return [...userList].sort((a: UserResponse, b: UserResponse) => {
            // @ts-ignore
            const first = a[sortDescriptor.column] as number;
            // @ts-ignore
            const second = b[sortDescriptor.column] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, userList]);

    const getTopContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon/>}
                        // value={filterValue}
                        // onClear={() => onClear()}
                        // onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        {/*TODO add filtering using status*/}
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
                                {userTableColumns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon/>}>
                            Add New
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [
        statusFilter,
        visibleColumns,
    ]);

    function getBottomContent() {
        return totalPages > 0 ? (
            <div className="py-2 px-2 flex justify-between items-center">
                <p className="text-small justify-items-start text-default-500">Page {currentPage} of {totalPages}</p>
                <Pagination
                    loop
                    showControls
                    showShadow
                    className="text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
                    color="warning"
                    radius="full"
                    page={currentPage}
                    total={totalPages}
                    onChange={(page) => setCurrentPage(page)}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={totalPages === 1}
                        onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                        color="warning"
                        className="text-black-2 bg-meta-6"
                        size="sm"
                        variant="flat">
                        Previous
                    </Button>
                    <Button
                        isDisabled={totalPages === 1}
                        onPress={() => setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))}
                        size="sm"
                        className="text-black-2 bg-meta-6"
                        color="warning"
                        variant="flat">
                        Next
                    </Button>
                </div>
            </div>
        ) : null;
    }

    /**
     * custom cell rendering
     */
    const renderCell = React.useCallback((user: UserResponse, columnKey: React.Key) => {
        // @ts-ignore
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-black-2">{user.email}</p>
                    </div>
                );
            case "name":
                return (
                    <User
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
    }, []);

    return (
        <Table
            aria-label="Pagination"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            topContent={getTopContent}
            topContentPlacement="outside"
            bottomContent={getBottomContent()}>
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={sortedItems}
                loadingContent={<Spinner/>}
                loadingState={isLoading ? "loading" : "idle"}>
                {(user: UserResponse) => (
                    <TableRow key={user.id}>
                        {(columnKey) =>
                            <TableCell>
                                {renderCell(user, columnKey)}
                            </TableCell>
                        }
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

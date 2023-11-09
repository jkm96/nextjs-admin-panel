import React, {useState, useEffect} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, SortDescriptor, Selection,
} from "@nextui-org/react";
import {getUsers} from "@/lib/users/userService";
import {UserResponse} from "@/boundary/interfaces/user";
import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";
import {SearchIcon} from "@/components/shared/icons/SearchIcon";
import {ChevronDownIcon} from "@/components/shared/icons/ChevronDownIcon";
import {capitalize, statusOptions, userTableColumns} from "@/lib/utils/tableUtils";
import {PlusIcon} from "@/components/shared/icons/PlusIcon";

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "status", "actions"];
export default function App() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "email",
        direction: "ascending",
    });

    const fetchUsers = (queryParams: UserQueryParameters) => {
        getUsers(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    console.log("paging metadata", pagingMetaData)
                    setPage(pagingMetaData.currentPage);
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
        queryParams.pageNumber = page;
        fetchUsers(queryParams);
    }, [page]);

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
                    {/*<Input*/}
                    {/*    isClearable*/}
                    {/*    className="w-full sm:max-w-[44%]"*/}
                    {/*    placeholder="Search by name..."*/}
                    {/*    startContent={<SearchIcon/>}*/}
                    {/*    value={filterValue}*/}
                    {/*    onClear={() => onClear()}*/}
                    {/*    onValueChange={onSearchChange}*/}
                    {/*/>*/}
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
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
                                onSelectionChange={setVisibleColumns}
                            >
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
        // filterValue,
        statusFilter,
        visibleColumns,
        // onSearchChange,
        // onRowsPerPageChange,
        // users.length,
        // hasSearchFilter,
    ]);


    const getBottomContent = React.useMemo(() => {
        return totalPages > 0 ? (
            <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                />
            </div>
        ) : null;
    }, []);

    return (
        <Table
            aria-label="Pagination"
            bottomContent={getBottomContent}
            topContent={getTopContent}
            topContentPlacement="outside"
        >
            <TableHeader>
                <TableColumn key="name">Name</TableColumn>
                <TableColumn key="email">Email</TableColumn>
                <TableColumn key="status">Status</TableColumn>
                <TableColumn key="emailConfirmed">Email Confirmed</TableColumn>
            </TableHeader>
            <TableBody
                items={userList}
                loadingContent={<Spinner/>}
                loadingState={isLoading ? "loading" : "idle"}
            >
                {(user: UserResponse) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.isActive}</TableCell>
                        <TableCell>{user.emailConfirmed}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

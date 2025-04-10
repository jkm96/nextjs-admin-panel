import React, {useState, useEffect} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    SortDescriptor,
    Selection,
    ChipProps, Button,
} from "@nextui-org/react";
import {getUsers} from "@/lib/services/accountmngt/userService";
import {UserResponse} from "@/boundary/interfaces/user";
import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";
import {roleTableColumns, userTableColumns} from "@/lib/utils/tableUtils";
import PaginationComponent from "@/components/common/pagination/PaginationComponent";
import RenderUserCell from "@/components/accountmngt/users/RenderUserCell";
import SearchComponent from "@/components/common/filter/SearchComponent";
import CreateUserModal from "@/components/accountmngt/users/modals/CreateUserModal";
import {TableVisibleColumns} from "@/components/common/filter/TableVisibleColumns";
import {PlusIcon} from "@/components/shared/icons/PlusIcon";
import CreateRoleModal from "@/components/accountmngt/roles/modals/CreateRoleModal";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {toast} from "react-toastify";

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "status", "actions"];

export default function UsersMainSection({query}: { query: string; }) {
    const [canCreateUser, setCanCreateUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    /**
     * fetch user data from api
     * @param queryParams
     */
    const fetchUsers = async (queryParams: UserQueryParameters) => {
        await getUsers(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setUserList(data);
                }
            })
            .catch((error) => {
                toast.error(`Error fetching users: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: UserQueryParameters = new UserQueryParameters();
        queryParams.pageNumber = currentPage;
        queryParams.searchTerm = query;
        fetchUsers(queryParams);
    }, [currentPage, query]);

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

    /**
     * user table visible columns e.g. filter
     */
    const getUserVisibleColumns = React.useMemo(() => {
        return <TableVisibleColumns
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            tableColumns={userTableColumns}
        />
    }, [visibleColumns]);

    /**
     * user table pagination
     */
    function getBottomContent() {
        return PaginationComponent(totalPages, currentPage, setCurrentPage);
    }

    /**
     * custom cell rendering
     */
    const renderCell = React.useCallback((user: UserResponse, columnKey: React.Key) => {
        return RenderUserCell(user, columnKey, statusColorMap);
    }, []);

    useEffect(() => {
        async function checkPermission() {
            const canCreateUser = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersCreate)]);
            setCanCreateUser(canCreateUser)
        }

        checkPermission();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between gap-3 items-end">
                    <SearchComponent placeholder="Search for users"/>
                    <div className="flex gap-3">
                        {getUserVisibleColumns}
                        {canCreateUser && (
                            <>
                                <Button onPress={handleOpenModal}
                                        startContent={<PlusIcon/>}
                                        color="primary"
                                        variant="shadow">
                                    Add New
                                </Button>
                                <CreateUserModal isOpen={isModalOpen} onClose={handleCloseModal}/>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Table
                aria-label="Pagination"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
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
                    emptyContent={!isLoading && userList.length === 0 ? "No data to display." : null}
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
        </>
    );
}

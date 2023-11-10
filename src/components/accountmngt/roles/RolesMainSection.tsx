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
} from "@nextui-org/react";
import {roleTableColumns} from "@/lib/utils/tableUtils";
import PaginationComponent from "@/components/common/pagination/PaginationComponent";
import SearchComponent from "@/components/common/search/SearchComponent";
import CreateUserModal from "@/components/accountmngt/users/modals/CreateUserModal";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {RoleResponse} from "@/boundary/interfaces/role";
import {RoleVisibleColumns} from "@/components/accountmngt/roles/RoleVisibleColumns";
import RenderRoleCell from "@/components/accountmngt/roles/RenderRoleCell";
import {getRoles} from "@/lib/services/accountmngt/roleService";

const INITIAL_VISIBLE_COLUMNS = ["name", "description", "actions"];

export default function RolesMainSection({query}: { query: string; }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [roleList, setRoleList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return roleTableColumns;
        return roleTableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    /**
     * fetch role data from api
     * @param queryParams
     */
    const fetchRoles = (queryParams: RoleQueryParameters) => {
        getRoles(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    console.log("data", data)
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setRoleList(data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching roles: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: RoleQueryParameters = new RoleQueryParameters();
        queryParams.pageNumber = currentPage;
        queryParams.searchTerm = query;
        fetchRoles(queryParams);
    }, [currentPage, query]);

    /***
     *sorting data
     **/
    const sortedItems = React.useMemo(() => {
        return [...roleList].sort((a: RoleResponse, b: RoleResponse) => {
            // @ts-ignore
            const first = a[sortDescriptor.column] as number;
            // @ts-ignore
            const second = b[sortDescriptor.column] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, roleList]);

    /**
     * role table visible columns e.g. search
     */
    const getRoleVisibleColumns = React.useMemo(() => {
        return RoleVisibleColumns(visibleColumns, setVisibleColumns);
    }, [visibleColumns]);

    /**
     * role table pagination
     */
    function getBottomContent() {
        return PaginationComponent(totalPages, currentPage, setCurrentPage);
    }

    /**
     * custom cell rendering
     */
    const renderCell = React.useCallback((role: RoleResponse, columnKey: React.Key) => {
        return RenderRoleCell(role, columnKey);
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between gap-3 items-end">
                    <SearchComponent placeholder="Search for roles"/>
                    <div className="flex gap-3">
                        {getRoleVisibleColumns}
                        {/*<CreateUserModal/>*/}
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
                    items={sortedItems}
                    loadingContent={<Spinner/>}
                    loadingState={isLoading ? "loading" : "idle"}>
                    {(role: RoleResponse) => (
                        <TableRow key={role.id}>
                            {(columnKey) =>
                                <TableCell>
                                    {renderCell(role, columnKey)}
                                </TableCell>
                            }
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

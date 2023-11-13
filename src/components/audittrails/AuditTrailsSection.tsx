import React, {useEffect, useState} from "react";
import {
    ChipProps,
    Selection,
    SortDescriptor,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import {auditTableColumns} from "@/lib/utils/tableUtils";
import PaginationComponent from "@/components/common/pagination/PaginationComponent";
import SearchComponent from "@/components/common/filter/SearchComponent";
import {TableVisibleColumns} from "@/components/common/filter/TableVisibleColumns";
import {AuditQueryParameters} from "@/boundary/parameters/AuditQueryParameters";
import {getAuditRecords} from "@/lib/services/audit/auditTrailService";
import {AppAuditType, AuditRecordResponse} from "@/boundary/interfaces/audit";
import RenderAuditTrailCell from "@/components/audittrails/RenderAuditTrailCell";

const INITIAL_VISIBLE_COLUMNS = ["module", "auditType","description", "creatorEmail","createdOn", "actions"];

export default function AuditTrailsSection({query}: { query: string; }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [auditRecords, setAuditRecords] = useState([]);
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
        if (visibleColumns === "all") return auditTableColumns;
        return auditTableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    /**
     * fetch user data from api
     * @param queryParams
     */
    const fetchAuditRecords = (queryParams: AuditQueryParameters) => {
        getAuditRecords(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setAuditRecords(data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching audit records: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: AuditQueryParameters = new AuditQueryParameters();
        queryParams.pageNumber = currentPage;
        queryParams.searchTerm = query;
        queryParams.auditType = AppAuditType.Visit;
        fetchAuditRecords(queryParams);
    }, [currentPage, query]);

    /***
     *sorting data
     **/
    const sortedItems = React.useMemo(() => {
        return [...auditRecords].sort((a: AuditRecordResponse, b: AuditRecordResponse) => {
            // @ts-ignore
            const first = a[sortDescriptor.column] as number;
            // @ts-ignore
            const second = b[sortDescriptor.column] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, auditRecords]);

    /**
     * audit table visible columns e.g. filter
     */
    const getAuditVisibleColumns = React.useMemo(() => {
        return <TableVisibleColumns
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            tableColumns={auditTableColumns}
        />
    }, [visibleColumns]);

    /**
     * audit table pagination
     */
    function getBottomContent() {
        return PaginationComponent(totalPages, currentPage, setCurrentPage);
    }

    /**
     * custom cell rendering
     */
    const renderCell = React.useCallback((user: AuditRecordResponse, columnKey: React.Key) => {
        return RenderAuditTrailCell(user, columnKey, statusColorMap);
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between gap-3 items-end">
                    <SearchComponent placeholder="Search for audit trails"/>
                    <div className="flex gap-3">
                        {getAuditVisibleColumns}
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
                    emptyContent={!isLoading && auditRecords.length === 0 ? "No data to display." : null}
                    items={sortedItems}
                    loadingContent={<Spinner/>}
                    loadingState={isLoading ? "loading" : "idle"}>
                    {(auditRecord: AuditRecordResponse) => (
                        <TableRow key={auditRecord.id}>
                            {(columnKey) =>
                                <TableCell>
                                    {renderCell(auditRecord, columnKey)}
                                </TableCell>
                            }
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

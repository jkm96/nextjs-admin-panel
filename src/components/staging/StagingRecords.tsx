"use client";
import React, {useEffect, useState} from 'react';
import {
    Button,
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
    Selection,
    SortDescriptor,
    Spinner,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {stagingTableColumns} from "@/lib/utils/tableUtils";
import {StagingQueryParameters} from "@/boundary/parameters/StagingQueryParameters";
import {getStagedRecords} from "@/lib/services/staging/stagingRecordService";
import {AppModule, StagingRecordStatus, StagingResponse} from "@/boundary/interfaces/staging";
import PaginationComponent from "@/components/common/pagination/PaginationComponent";
import RenderStagingCell from "@/components/staging/RenderStagingCell";
import SearchComponent from "@/components/common/filter/SearchComponent";
import {TableVisibleColumns} from "@/components/common/filter/TableVisibleColumns";
import {getActionsForModule} from "@/helpers/stagingHelpers";
import {UserModuleActions} from "@/lib/utils/stagingUtils";

const INITIAL_VISIBLE_COLUMNS = ["entity", "action", "creator", "actions"];

const StagedRecords = () => {
    const [selectedModule, setSelectedModule] = useState(AppModule.USERS);
    const [selectedAction, setSelectedAction] = useState(UserModuleActions[0].permission);
    const [stagedRecords, setStagedRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return stagingTableColumns;
        return stagingTableColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);


    const fetchStagedRecords = (queryParams: StagingQueryParameters) => {
        getStagedRecords(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    console.log("staging data", data)
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setStagedRecords(data);
                }
            })
            .catch((error) => {
                console.error(`Error fetching staged records: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: StagingQueryParameters = new StagingQueryParameters();
        queryParams.pageNumber = currentPage;
        queryParams.action = selectedAction;
        queryParams.status = StagingRecordStatus.Pending;
        console.log("queryParams", queryParams)
        fetchStagedRecords(queryParams);
    }, [currentPage, selectedModule, selectedAction]);

    /***
     *sorting data
     **/
    const sortedItems = React.useMemo(() => {
        return [...stagedRecords].sort((a: StagingResponse, b: StagingResponse) => {
            // @ts-ignore
            const first = a[sortDescriptor.column] as number;
            // @ts-ignore
            const second = b[sortDescriptor.column] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, stagedRecords]);

    /**
     * staging table visible columns e.g. filter
     */
    const getVisibleColumns = React.useMemo(() => {
        return <TableVisibleColumns
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            tableColumns={stagingTableColumns}
        />
    }, [visibleColumns]);

    /**
     * staging table pagination
     */
    function getBottomContent() {
        return PaginationComponent(totalPages, currentPage, setCurrentPage);
    }

    /**
     * custom cell rendering
     */
    const renderCell = React.useCallback((stagingRecord: StagingResponse, columnKey: React.Key) => {
        return RenderStagingCell(stagingRecord, columnKey);
    }, []);

    // Handle module selection change
    const handleModuleChange = (e: any) => {
        const newModule = e.target.value as AppModule;
        setSelectedModule(newModule);
        // Set the default action for the selected module
        const defaultAction = getActionsForModule(newModule)[0];
        setSelectedAction(defaultAction.permission);
    };

    return (
        <>
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between gap-3 items-end">

                    <div className="flex gap-3">
                            <label htmlFor="default-input"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Select Module
                            </label>
                            <select
                                id="moduleDropdown"
                                value={selectedModule}
                                onChange={handleModuleChange}
                                className="peer block h-10 w-1/3 rounded-md border border-gray-200 py-[9px] pl-10 outline-2"
                            >
                                {Object.keys(AppModule).map((module) => (
                                    <option key={module} value={module}>
                                        {module}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="default-input"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Select Action
                            </label>
                            <select
                                id="actionDropdown"
                                value={selectedAction}
                                onChange={(e) => setSelectedAction(e.target.value)}
                                className="peer block h-10 w-1/3 rounded-md border border-gray-200 py-[9px] pl-10 outline-2"
                            >
                                {getActionsForModule(selectedModule).map((action) => (
                                    <option key={action.name} value={action.permission}>
                                        {action.name}
                                    </option>
                                ))}
                            </select>

                        {getVisibleColumns}

                    </div>

                    <SearchComponent placeholder="Search for staging"/>
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
                    {(stagingRecord: StagingResponse) => (
                        <TableRow key={stagingRecord.id}>
                            {(columnKey) =>
                                <TableCell>
                                    {renderCell(stagingRecord, columnKey)}
                                </TableCell>
                            }
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default StagedRecords;

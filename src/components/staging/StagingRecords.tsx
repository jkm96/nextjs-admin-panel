import React, {useEffect, useState} from 'react';
import {
    Button,
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
    SortDescriptor,
    Spinner,
    Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader,
    TableRow, useDisclosure
} from "@nextui-org/react";
import {StagingQueryParameters} from "@/boundary/parameters/StagingQueryParameters";
import {getStagedRecords} from "@/lib/services/staging/stagingRecordService";
import {AppModulesDict, StagingRecordStatus, StagingResponse} from "@/boundary/interfaces/staging";
import PaginationComponent from "@/components/common/pagination/PaginationComponent";
import SearchComponent from "@/components/common/filter/SearchComponent";
import {getActionsForModule} from "@/helpers/stagingHelpers";
import {UserModuleActions} from "@/lib/utils/stagingUtils";
import {ChevronDownIcon} from "@/components/shared/icons/ChevronDownIcon";
import {EyeFilledIcon} from "@nextui-org/shared-icons";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import ApproveNewUserModal from "@/components/accountmngt/users/modals/ApproveNewUserModal";
import ApproveNewRoleModal from "@/components/accountmngt/roles/modals/ApproveNewRoleModal";
import {toast} from "react-toastify";
import ApproveUpdateUserModal from "@/components/accountmngt/users/modals/ApproveUpdateUserModal";
import ApproveToggleUserModal from "@/components/accountmngt/users/modals/ApproveToggleUserModal";
import ApproveEditUserRolesModal from "@/components/accountmngt/users/modals/ApproveEditUserRolesModal";

const StagedRecords = ({query}: { query: string; }) => {
    const [selectedModule, setSelectedModule] = useState(AppModulesDict[0].name);
    const [selectedAction, setSelectedAction] = useState(UserModuleActions[0].name);
    const [selectedActionValue, setSelectedActionValue] = useState(UserModuleActions[0].permission);
    const [stagedRecords, setStagedRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedStagingRecord, setSelectedStagingRecord] = useState<StagingResponse | null>(null);

    const fetchStagedRecords = (queryParams: StagingQueryParameters) => {
        getStagedRecords(queryParams)
            .then((response) => {
                if (response.statusCode === 200) {
                    const parsedData = response.data;
                    const {data, pagingMetaData} = parsedData;
                    setCurrentPage(pagingMetaData.currentPage);
                    setRowsPerPage(pagingMetaData.pageSize);
                    setTotalPages(pagingMetaData.totalPages);
                    setStagedRecords(data);
                }
            })
            .catch((error) => {
                toast.error(`Error fetching staged records: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        const queryParams: StagingQueryParameters = new StagingQueryParameters();
        queryParams.pageNumber = currentPage;
        queryParams.action = selectedActionValue;
        queryParams.status = StagingRecordStatus.Pending;
        queryParams.searchTerm = query;
        console.log("queryParams", queryParams)
        fetchStagedRecords(queryParams);
    }, [currentPage, selectedModule, selectedAction, query]);

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
     * staging table pagination
     */
    function getBottomContent() {
        return PaginationComponent(totalPages, currentPage, setCurrentPage);
    }

    // Handle module selection change
    const handleModuleChange = (module: any) => {
        const newModule = module.toUpperCase()
        setSelectedModule(newModule);
        // Set the default action for the selected module
        const defaultAction = getActionsForModule(newModule)[0];
        setSelectedAction(defaultAction.name);
        setSelectedActionValue(defaultAction.permission);
    };

    const handleViewClick = (stagingRecord: StagingResponse | null) => {
        setSelectedStagingRecord(stagingRecord);
        onOpen();
    };

    const handleCloseModal = () => {
        setSelectedStagingRecord(null);
        onOpenChange();
    };

    const getModalForAction = (stagingRecord: StagingResponse) => {
        switch (stagingRecord.action) {
            case MapPermission(AdminPortalPermission.PermissionsUsersCreate):
                return (
                    <ApproveNewUserModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            case MapPermission(AdminPortalPermission.PermissionsUsersEdit):
                return (
                    <ApproveUpdateUserModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            case MapPermission(AdminPortalPermission.PermissionsUsersActivate):
                return (
                    <ApproveToggleUserModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            case MapPermission(AdminPortalPermission.PermissionsUsersDeactivate):
                return (
                    <ApproveToggleUserModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            case MapPermission(AdminPortalPermission.PermissionsUsersManageRoles):
                return (
                    <ApproveEditUserRolesModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            case MapPermission(AdminPortalPermission.PermissionsRolesCreate):
                return (
                    <ApproveNewRoleModal
                        stagingRecord={stagingRecord}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 mb-2">
                <div className="flex justify-between gap-3 items-end">

                    <div className="flex gap-3">
                        <label htmlFor="default-input"
                               className="text-sm font-medium text-gray-900 dark:text-white">
                            Select Module
                        </label>

                        <Dropdown>
                            <DropdownTrigger>
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="bordered"
                                >
                                    {selectedModule ? `${selectedModule}` : 'Select Module'}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dynamic Actions"
                                          disallowEmptySelection
                                          selectionMode="single"
                                          onAction={(key) => handleModuleChange(key)}
                                          items={AppModulesDict}>
                                {(item) => (
                                    <DropdownItem key={item.key}>
                                        {item.name}
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>

                        <label htmlFor="default-input"
                               className="text-sm font-medium text-gray-900 dark:text-white">
                            Select Action
                        </label>

                        <Dropdown>
                            <DropdownTrigger>
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="bordered"
                                >
                                    {selectedAction ? `${selectedAction}` : 'Select Action'}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dynamic Actions"
                                          disallowEmptySelection
                                          selectionMode="single"
                                          items={getActionsForModule(selectedModule)}>
                                {(item) => (
                                    <DropdownItem
                                        key={item.name}
                                        value={item.permission}
                                        onPress={() => {
                                            setSelectedAction(item.name)
                                            setSelectedActionValue(item.permission);
                                        }}
                                    >
                                        {item.name}
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
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
                <TableHeader>
                    <TableColumn>Entity</TableColumn>
                    <TableColumn>Action</TableColumn>
                    <TableColumn>Creator</TableColumn>
                    <TableColumn>Date Created</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={!isLoading && stagedRecords.length === 0 ? "No data to display." : null}
                    items={sortedItems}
                    loadingContent={<Spinner/>}
                    loadingState={isLoading ? "loading" : "idle"}>
                    {(stagingRecord: StagingResponse) => (
                        <TableRow key={stagingRecord.id}>
                            <TableCell>{stagingRecord.entity}</TableCell>
                            <TableCell>{stagingRecord.action}</TableCell>
                            <TableCell>{stagingRecord.creator}</TableCell>
                            <TableCell>{stagingRecord.dateCreated}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleViewClick(stagingRecord)}
                                    startContent={<EyeFilledIcon/>}
                                    color="primary"
                                    variant="shadow">
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {selectedStagingRecord && getModalForAction(selectedStagingRecord)}
        </>
    );
};

export default StagedRecords;

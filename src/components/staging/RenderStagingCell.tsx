import React, {useState} from "react";
import {StagingResponse} from "@/boundary/interfaces/staging";
import ApproveNewUserModal from "@/components/accountmngt/users/modals/ApproveNewUserModal";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {Button} from "@nextui-org/react";
import {EyeFilledIcon} from "@nextui-org/shared-icons";
import stagingRecords from "@/components/staging/StagingRecords";

export default function RenderStagingCell(stagingRecord: StagingResponse, columnKey: string | number | bigint) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // @ts-ignore
    const cellValue = stagingRecord[columnKey];
    if (columnKey === "actions") {
        const action = stagingRecord.action;
        console.log("action",action)
        switch (action) {
            case MapPermission(AdminPortalPermission.PermissionsUsersCreate):
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Button onPress={handleOpenModal}
                                startContent={<EyeFilledIcon/>}
                                color="primary"
                                variant="shadow">
                            View
                        </Button>
                        <ApproveNewUserModal stagingRecord={stagingRecord} isOpen={isModalOpen} onClose={handleCloseModal}/>
                    </div>
                );

        }
    }

    return cellValue;
}

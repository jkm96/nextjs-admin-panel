"use client"
import StagingRecords from "@/components/staging/StagingRecords";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import VisitAuditing from "@/components/common/audit/VisitAuditing";

function StagingRecordPage({searchParams}: { searchParams?: { query?: string; }; }) {
    const query = searchParams?.query || '';
    return (
        <>
            <VisitAuditing page={"dashboard"}/>
            <StagingRecords query={query}/>
        </>
    )

}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsStagingRecordsView)
export default AuthorizeComponent([viewPermission])(StagingRecordPage);
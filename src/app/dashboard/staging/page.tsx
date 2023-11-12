"use client"
import StagingRecords from "@/components/staging/StagingRecords";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
function StagingRecordPage({searchParams}: { searchParams?: { query?: string; }; }) {
    const query = searchParams?.query || '';
    return <StagingRecords query={query}/>
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersView)
export default AuthorizeComponent([viewPermission])(StagingRecordPage);
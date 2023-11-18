"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import DashboardSection from "@/components/dashboard/DashboardSection";
import VisitAuditing from "@/components/common/audit/VisitAuditing";

function DashboardPage() {
    return (
        <>
            <VisitAuditing page={"dashboard"}/>
            <DashboardSection/>
        </>
    )
}


const viewPermission = MapPermission(AdminPortalPermission.PermissionsAccessAll)
export default AuthorizeComponent([viewPermission])(DashboardPage)
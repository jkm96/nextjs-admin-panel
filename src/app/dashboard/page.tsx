"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import DashboardSection from "@/components/dashboard/DashboardSection";
import {useEffect} from "react";
import visitAuditing from "@/helpers/auditHelpers";

function DashboardPage() {
    console.log("Executing useEffect");
    useEffect(() => {
        async function trackPage() {
            await visitAuditing("dashboard")
        }
        trackPage();
    }, []);
    return   <DashboardSection/>
}


const viewPermission = MapPermission(AdminPortalPermission.PermissionsAccessAll)
export default AuthorizeComponent([viewPermission])(DashboardPage)
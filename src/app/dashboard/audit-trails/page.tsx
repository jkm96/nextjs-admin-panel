"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/accountmngt/users/UsersMainSection";
import RolesMainSection from "@/components/accountmngt/roles/RolesMainSection";
import AuditTrailsSection from "@/components/audittrails/AuditTrailsSection";
import VisitAuditing from "@/components/common/audit/VisitAuditing";
import React from "react";

function AuditTrailsPage({searchParams}: { searchParams?: { query?: string; }; }) {
    const query = searchParams?.query || '';
    return (
        <>
            <VisitAuditing page={"dashboard"}/>
            <AuditTrailsSection query={query}/>
        </>
    )

}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsAuditTrailsView)
export default AuthorizeComponent([viewPermission])(AuditTrailsPage);
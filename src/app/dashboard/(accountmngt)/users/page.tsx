"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/accountmngt/users/UsersMainSection";
import VisitAuditing from "@/components/common/audit/VisitAuditing";
import React from "react";

function UsersPage({searchParams}: { searchParams?: { query?: string; }; }) {
    const query = searchParams?.query || '';
    return (
        <>
            <VisitAuditing page={"dashboard"}/>
            <UsersMainSection query={query}/>
        </>
    )
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersView)
export default AuthorizeComponent([viewPermission])(UsersPage);
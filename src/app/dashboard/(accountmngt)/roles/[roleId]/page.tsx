"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/accountmngt/users/UsersMainSection";
import RolesMainSection from "@/components/accountmngt/roles/RolesMainSection";
import VisitAuditing from "@/components/common/audit/VisitAuditing";
import React from "react";
import ManageRoleSection from "@/components/accountmngt/roles/ManageRoleSection";
import ManageUserSection from "@/components/accountmngt/users/ManageUserSection";

function ManageRolePage({params}: { params: { roleId: string } }) {
    return <ManageRoleSection roleId={params.roleId}/>;
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsRolesView)
export default AuthorizeComponent([viewPermission])(ManageRolePage);
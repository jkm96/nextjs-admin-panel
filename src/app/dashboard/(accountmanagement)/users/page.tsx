"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/users/UsersMainSection";
import UsersTable from "@/components/users/UsersTable";

function UsersPage() {
    return <UsersTable/>;
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersView)
export default AuthorizeComponent( [viewPermission])(UsersPage);
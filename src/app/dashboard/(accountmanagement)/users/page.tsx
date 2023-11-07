"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/users/UsersMainSection";

function UsersPage() {
    return <UsersMainSection/>;
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersView)
export default AuthorizeComponent( [viewPermission])(UsersPage);
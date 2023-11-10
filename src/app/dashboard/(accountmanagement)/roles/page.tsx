"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import UsersMainSection from "@/components/accountmngt/users/UsersMainSection";
import RolesMainSection from "@/components/accountmngt/roles/RolesMainSection";

function RolesPage({searchParams}: { searchParams?: { query?: string; }; }) {
    const query = searchParams?.query || '';
    return <RolesMainSection query={query}/>;
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsRolesView)
export default AuthorizeComponent([viewPermission])(RolesPage);
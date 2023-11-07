import {useEffect} from "react";
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";

function DashboardPage() {
    useEffect(() => {
        async function fetchData() {
            const canViewRoles = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsRolesView)]);
            const canViewUsers = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersView)]);
            const canEditUser = await hasRequiredPermissions([MapPermission(AdminPortalPermission.PermissionsUsersEdit)]);
            console.log("can view roles", canViewRoles)
            console.log("can view users", canViewUsers)
            console.log("can edit users", canEditUser)
            // setCanEdit(canEdit);
        }

        fetchData();
    }, []);
    return(
        <>
            <p>Dashboard Page</p>
        </>
    )
}
const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersCreate)
export default AuthorizeComponent( [viewPermission])(DashboardPage);
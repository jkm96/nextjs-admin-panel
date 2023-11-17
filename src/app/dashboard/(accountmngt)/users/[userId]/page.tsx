"use client";
import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import AuthorizeComponent from "@/components/common/auth/AuthorizeComponent";
import ManageUserSection from "@/components/accountmngt/users/ManageUserSection";

function ManageUserPage({params}: { params: { userId: string } }) {
    return <ManageUserSection userId={params.userId}/>;
}

const viewPermission = MapPermission(AdminPortalPermission.PermissionsUsersView)
export default AuthorizeComponent([viewPermission])(ManageUserPage);
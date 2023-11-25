import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";

const UserModuleActions = [
    { name: "New", permission: MapPermission(AdminPortalPermission.PermissionsUsersCreate)},
    { name: "Edits", permission: MapPermission(AdminPortalPermission.PermissionsUsersEdit) },
    { name: "Deletions", permission:  MapPermission(AdminPortalPermission.PermissionsUsersDelete) },
    { name: "Role Edits", permission: MapPermission(AdminPortalPermission.PermissionsUsersManageRoles)  },
    { name: "Activations", permission:  MapPermission(AdminPortalPermission.PermissionsUsersToggleStatus) },
    { name: "Deactivations", permission:  MapPermission(AdminPortalPermission.PermissionsUsersToggleStatus) },
];

const RoleModuleActions = [
    { name: "New", permission:  MapPermission(AdminPortalPermission.PermissionsRolesCreate) },
    { name: "Edits", permission:  MapPermission(AdminPortalPermission.PermissionsRolesEdit) },
    { name: "RoleClaims Edit", permission: MapPermission(AdminPortalPermission.PermissionsRoleClaimsEdit)},
];

export {UserModuleActions,RoleModuleActions}
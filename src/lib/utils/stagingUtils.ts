import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";

const UserModuleActions = [
    { name: "New", permission: MapPermission(AdminPortalPermission.PermissionsUsersCreate)},
    { name: "Edits", permission: MapPermission(AdminPortalPermission.PermissionsUsersEdit) },
    { name: "Deletions", permission: "PermissionsUsersDelete" },
    { name: "Activations", permission: "PermissionsUsersActivate" },
    { name: "Deactivations", permission: "PermissionsUsersDeactivate" },
];

const RoleModuleActions = [
    { name: "New", permission: "PermissionsRolesCreate" },
    { name: "Edits", permission: "PermissionsRolesEdit" },
];

export {UserModuleActions,RoleModuleActions}
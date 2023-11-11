
const UserModuleActions = [
    { name: "New", permission: "PermissionsUsersCreate" },
    { name: "Edits", permission: "PermissionsUsersEdit" },
    { name: "Deletions", permission: "PermissionsUsersDelete" },
    { name: "Activations", permission: "PermissionsUsersActivate" },
    { name: "De-Activations", permission: "PermissionsUsersDeactivate" },
];

const RoleModuleActions = [
    { name: "Create", permission: "PermissionsRolesCreate" },
    { name: "Edit", permission: "PermissionsRolesEdit" },
];

export {UserModuleActions,RoleModuleActions}
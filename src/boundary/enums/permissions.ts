enum AdminPortalPermission {
    // Users
    PermissionsUsersView = 150,
    PermissionsUsersCreate = 151,
    PermissionsUsersPasswordReset = 152,
    PermissionsUsersToggleStatus = 153,
    PermissionsUsersResendConfirmation = 155,
    PermissionsUsersManageRoles = 157,
    PermissionsUsersEdit = 158,
    PermissionsUsersDelete = 159,
    PermissionsUsersExport = 160,
    PermissionsUsersSearch = 161,
    PermissionsUsersApproveCreate = 162,
    PermissionsUsersApproveEdit = 163,
    PermissionsUsersApproveToggleStatus = 164,
    PermissionsUsersApproveResendConfirmation = 166,
    PermissionsUsersApproveManageRoles = 167,
    PermissionsUsersApproveDelete = 168,
    PermissionsUsersApprovePasswordReset = 169,

    // Roles
    PermissionsRolesView = 200,
    PermissionsRolesExport = 201,
    PermissionsRolesCreate = 202,
    PermissionsRolesEdit = 203,
    PermissionsRolesDelete = 204,
    PermissionsRolesSearch = 205,
    PermissionsRolesApproveCreate = 206,
    PermissionsRolesApproveEdit = 207,
    PermissionsRolesApproveDelete = 208,

    // RoleClaims
    PermissionsRoleClaimsView = 250,
    PermissionsRoleClaimsCreate = 251,
    PermissionsRoleClaimsEdit = 252,
    PermissionsRoleClaimsDelete = 253,
    PermissionsRoleClaimsApproveCreate = 254,
    PermissionsRoleClaimsSearch = 255,
    PermissionsRoleClaimsApproveEdit = 256,
    PermissionsRoleClaimsApproveDelete = 257,
    PermissionsRoleClaimsExport = 258,

    // AuditTrails
    PermissionsAuditTrailsView = 400,
    PermissionsAuditTrailsExport = 401,
    PermissionsAuditTrailsSearch = 402,

    // SecurityPolicy
    PermissionsSecurityPolicyView = 450,
    PermissionsSecurityPolicyApprove = 451,
    PermissionsSecurityPolicyEdit = 452,

    // Staging Records
    PermissionsStagingRecordsView = 500,
    PermissionsStagingRecordsSearch = 501,

    // SuperAdmin
    PermissionsAccessAll = 9998,
}

export default AdminPortalPermission;


export function MapPermission(value: number): string {
    for (const key in AdminPortalPermission) {
        if ((AdminPortalPermission as any)[key] === value) {
            return key;
        }
    }
    return "";
}
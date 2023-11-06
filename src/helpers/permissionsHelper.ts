import AdminPortalPermission, {MapPermission} from "@/boundary/enums/permissions";
import {getAccessToken} from "@/lib/token/tokenService";
import {getUserPackedPermissions} from "@/lib/jwt/readAuthToken";

export async function hasRequiredPermissions(requiredPermissions: string[]): Promise<boolean> {
    //TODO get packed permissions string from auth token
    const response = await getAccessToken();
    if (response.statusCode === 200) {
        const tokenResponse = response.data;
        const {accessToken} = tokenResponse;
        const permissionString = getUserPackedPermissions(accessToken);
        const userPermissions = unpackPermissionsFromString(permissionString);
        console.log("user permissions", userPermissions)
        const trimmedUserPermissions = userPermissions.map(permission => permission.trim());

        const alwaysTruePermission = MapPermission(AdminPortalPermission.PermissionsAccessAll)
        if (requiredPermissions.includes(alwaysTruePermission)) {
            return true;
        }

        return requiredPermissions.some((permission) =>
            trimmedUserPermissions.includes(permission.trim())
        )
    }

    return false;
}

export function unpackPermissionsFromString(packedPermissions: string): string[] {
    if (packedPermissions === null) {
        throw new Error('packedPermissions cannot be null');
    }

    const unpackedPermissions: AdminPortalPermission[] = [];
    const enumValues = Object.values(AdminPortalPermission);
    const enumKeys = Object.keys(AdminPortalPermission);

    for (const char of packedPermissions) {
        const permissionValue = char.charCodeAt(0);
        const index = enumValues.indexOf(permissionValue);
        if (index !== -1) {
            unpackedPermissions.push(AdminPortalPermission[enumKeys[index] as keyof typeof AdminPortalPermission]);
        } else {
            console.log(`Invalid permission: ${char}`);
        }
    }

    return getEnumNamesFromValues(unpackedPermissions);
}

function getEnumNamesFromValues(values: number[]): string[] {
    return values.map((value) => AdminPortalPermission[value]);
}

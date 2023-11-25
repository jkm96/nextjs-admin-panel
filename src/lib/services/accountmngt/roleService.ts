import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {StagingUpsertRequest} from "@/boundary/interfaces/staging";
import {CreateRoleRequest, UpdateRolePermissionsRequest, UpdateRoleRequest} from "@/boundary/interfaces/role";

export async function createRole(request: CreateRoleRequest) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/create`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function updateRole(request: UpdateRoleRequest) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/update`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function updateRolePermissions(request: UpdateRolePermissionsRequest) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/permissions/update`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getRoleById(roleId: string) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/${roleId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getRoleUsers(roleId: string) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/roleusers/${roleId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getRolePermissions(roleId: string) {
    try {
        const apiUrl = `${internalBaseUrl}/roles/permissions/${roleId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getRoles(queryParams: RoleQueryParameters) {
    try {
        const queryString = new URLSearchParams(queryParams as Record<string, any>).toString();
        const apiUrl = `${internalBaseUrl}/roles/list?${queryString}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getRegisteredPermissions() {
    try {
        const apiUrl = `${internalBaseUrl}/roles/permissions`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}
import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {StagingUpsertRequest} from "@/boundary/interfaces/staging";
import {CreateRoleRequest} from "@/boundary/interfaces/role";

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
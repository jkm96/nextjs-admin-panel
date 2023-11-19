import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";
import {CreateUserRequest, ToggleUserStatusRequest, UpdateUserRequest} from "@/boundary/interfaces/user";

export async function getUsers(queryParams: UserQueryParameters) {
    try {
        const queryString = new URLSearchParams(queryParams as Record<string, any>).toString();
        const apiUrl = `${internalBaseUrl}/users/list?${queryString}`;
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

export async function createUser(createUserRequest: CreateUserRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/users/create`, {
            method: 'POST',
            headers: {
                'x-api-key': `${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(createUserRequest),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function updateUser(updateUserRequest: UpdateUserRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/users/update`, {
            method: 'POST',
            headers: {
                'x-api-key': `${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(updateUserRequest),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function toggleUserStatus(toggleUserRequest: ToggleUserStatusRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/users/toggle`, {
            method: 'POST',
            headers: {
                'x-api-key': `${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(toggleUserRequest),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getUserById(userId: string) {
    try {
        const apiUrl = `${internalBaseUrl}/users/${userId}`;
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
export async function getUserRoles(userId: string) {
    try {
        const apiUrl = `${internalBaseUrl}/users/userroles/${userId}`;
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
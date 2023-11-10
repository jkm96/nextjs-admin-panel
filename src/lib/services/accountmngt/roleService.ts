import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";

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
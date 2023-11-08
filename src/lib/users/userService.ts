import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";

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
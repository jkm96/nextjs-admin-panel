import {StoreTokenRequest} from "@/interfaces/token";
import {apiKey, internalBaseUrl} from "@/constants/appConstants";

export async function storeAccessTokenInCookie(storeTokenRequest: StoreTokenRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/token/store`, {
            method: 'POST',
            headers: {
                'x-api-key':`${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(storeTokenRequest),
            credentials: 'same-origin'
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getAccessToken() {
    try {
        const response = await fetch(`${internalBaseUrl}/token/retrieve`, {
            method: 'POST',
            headers: {
                'x-api-key':`${apiKey}`,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function deleteAccessToken() {
    try {
        const response = await fetch(`${internalBaseUrl}/token/delete`, {
            method: 'POST',
            headers: {
                'x-api-key':`${apiKey}`,
                'Content-type': 'application/json',
            },
            body: null,
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

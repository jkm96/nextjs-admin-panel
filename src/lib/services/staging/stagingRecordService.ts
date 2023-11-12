import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {StagingUpsertRequest} from "@/boundary/interfaces/staging";
 import {StagingQueryParameters} from "@/boundary/parameters/StagingQueryParameters";

export async function getStagedRecords(queryParams: StagingQueryParameters) {
    try {
        const queryString = new URLSearchParams(queryParams as Record<string, any>).toString();
        const apiUrl = `${internalBaseUrl}/staging/list?${queryString}`;
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

export async function upsertStagingRecord(createRequest: StagingUpsertRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/staging/upsert`, {
            method: 'POST',
            headers: {
                'x-api-key': `${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(createRequest),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

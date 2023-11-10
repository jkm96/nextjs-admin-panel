import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {StagingUpsertRequest} from "@/boundary/interfaces/staging";

export async function createStagingRecord(createRequest: StagingUpsertRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/staging/create`, {
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

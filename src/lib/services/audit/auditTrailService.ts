import {StagingUpsertRequest} from "@/boundary/interfaces/staging";
import {apiKey, internalBaseUrl} from "@/boundary/constants/appConstants";
import {AuditRecordRequest} from "@/boundary/interfaces/audit";
import {RoleQueryParameters} from "@/boundary/parameters/roleQueryParameters";
import {AuditQueryParameters} from "@/boundary/parameters/AuditQueryParameters";

export async function addAuditRecord(auditRequest: AuditRecordRequest) {
    try {
        const response = await fetch(`${internalBaseUrl}/audit/create`, {
            method: 'POST',
            headers: {
                'x-api-key': `${apiKey}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(auditRequest),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function getAuditRecords(queryParams: AuditQueryParameters) {
    try {
        const queryString = new URLSearchParams(queryParams as Record<string, any>).toString();
        const apiUrl = `${internalBaseUrl}/audit/list?${queryString}`;
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
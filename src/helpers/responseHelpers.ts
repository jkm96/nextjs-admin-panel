import {NextResponse} from "next/server";
import {AxiosError, AxiosResponse} from "axios";
import camelcaseKeys from 'camelcase-keys';
import {AdminApiErrorResponse} from "@/interfaces/shared";

export function handleAxiosResponse(response: AxiosResponse<any>) {
    const axiosResponse = response.data;
    if (axiosResponse.statusCode === 200) {
        return createNextResponse(200, "Success", axiosResponse.data)
    } else {
        return createNextResponse(axiosResponse.statusCode, axiosResponse.message)
    }
}

export function handleApiException(error: any) {
    if (error instanceof AxiosError) {
        // Handle Axios errors
        const axiosError = error as AxiosError;
        if (axiosError.response !== undefined) {
            console.log("error response", axiosError.response);
            console.log("error response data", axiosError.response?.data);
            console.log("error response status", axiosError.response?.status);
            const errorData: any = axiosError.response?.data;
            const errorResponse = camelcaseKeys(errorData, {deep: true}) as AdminApiErrorResponse;

            return createNextResponse(500, errorResponse.message, errorResponse)
        }

        switch (axiosError.code) {
            case "ECONNREFUSED":
                return createNextResponse(503, "Unable to connect to the server. Please try again later.")
        }
    }
    return createNextResponse(500, "An unhandled error occurred. Please try again later.")
}

export function createNextResponse(statusCode: number, message: string, data = {}) {
    return NextResponse.json({
        message,
        statusCode,
        data,
    });
}
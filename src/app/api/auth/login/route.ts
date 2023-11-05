import {handleAxiosResponse, handleApiException} from "@/helpers/responseHelpers";
import adminApiClient from "@/lib/axios/axiosClient";
import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.text();
        const response = await adminApiClient
            .post('auth/login', `${requestBody}`);
console.log("login api response",response.data)
        return handleAxiosResponse(response);
    } catch (error: unknown) {
        return handleApiException(error);
    }
}
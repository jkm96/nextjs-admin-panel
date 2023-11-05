import {NextRequest} from "next/server";
import {handleAxiosResponse, handleApiException} from "@/helpers/responseHelpers";
import adminApiClient from "@/lib/axios/axiosClient";

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.text();
        const response = await adminApiClient
            .post('auth/register', `${requestBody}`);

        return handleAxiosResponse(response);
    } catch (error: unknown) {
        return handleApiException(error);
    }
}

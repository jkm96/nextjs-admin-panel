import {NextRequest} from "next/server";
import {handleAxiosResponse, handleApiException} from "@/helpers/responseHelpers";
import adminApiClient from "@/lib/axios/axiosClient";
import {cookieName} from "@/boundary/constants/appConstants";
import {AxiosRequestConfig} from "axios";

export async function POST(request: NextRequest) {
    try {
        const tokenCookie = request.cookies.get(`${cookieName}`)?.value as string;
        const {accessToken} = JSON.parse(tokenCookie);
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        const requestBody = await request.text();
        const response = await adminApiClient
            .post('identity/user/create-user', `${requestBody}`,config);

        return handleAxiosResponse(response);
    } catch (error: unknown) {
        return handleApiException(error);
    }
}

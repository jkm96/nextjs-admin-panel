import {handleAxiosResponse, handleApiException} from "@/helpers/responseHelpers";
import adminApiClient from "@/lib/axios/axiosClient";
import {NextRequest} from "next/server";
import {cookieName} from "@/boundary/constants/appConstants";
import {AxiosRequestConfig} from "axios";
import {getStagingQueryParams} from "@/helpers/urlHelpers";

export async function GET(request: NextRequest) {
    try {
        const tokenCookie = request.cookies.get(`${cookieName}`)?.value as string;
        const {accessToken} = JSON.parse(tokenCookie);
        const queryParams = getStagingQueryParams(request);
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: queryParams
        };

        const response = await adminApiClient.get('staging-records', config);
        return handleAxiosResponse(response);
    } catch (error: unknown) {
        return handleApiException(error);
    }
}
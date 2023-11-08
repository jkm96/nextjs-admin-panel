import {handleAxiosResponse, handleApiException} from "@/helpers/responseHelpers";
import adminApiClient from "@/lib/axios/axiosClient";
import {NextRequest} from "next/server";
import {cookieName} from "@/boundary/constants/appConstants";
import {AxiosRequestConfig} from "axios";

export async function GET(request: NextRequest) {
    try {
        const tokenCookie = request.cookies.get(`${cookieName}`)?.value as string;
        const {accessToken} = JSON.parse(tokenCookie);

        const url = new URL(request.url)
        const searchParams = new URLSearchParams(url.search);
        const pageSize = searchParams.get('pageSize');
        const pageNumber = searchParams.get('pageNumber');
        const orderBy = searchParams.get('orderBy');
        const searchTerm = searchParams.get('searchTerm');
        console.log("search params", searchParams)
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                pageSize,
                pageNumber,
                orderBy,
                searchTerm
            }
        };

        const response = await adminApiClient.get('identity/user', config);
        console.log("fetch user response", response.data);
        return handleAxiosResponse(response);
    } catch (error: unknown) {
        return handleApiException(error);
    }
}
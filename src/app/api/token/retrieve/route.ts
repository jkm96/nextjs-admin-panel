import {NextRequest} from "next/server";
import {RefreshTokenRequest, StoreTokenRequest, TokenResponse} from "@/interfaces/token";
import adminApiClient from "@/lib/axios/axiosClient";
import {cookieName} from "@/constants/appConstants";
import {createNextResponse} from "@/helpers/responseHelpers";

export async function POST(request: NextRequest) {
    try {
        const tokenCookie = request.cookies.get(`${cookieName}`)?.value as string;
        if (tokenCookie !== undefined || tokenCookie !== '') {
            const {accessToken, refreshToken, expiresAt} = JSON.parse(tokenCookie);
            const expirationDate = new Date(expiresAt);
            const currentDate = new Date();
            if (expirationDate > currentDate) {//token not expired
                let tokenRes = {
                    accessToken: accessToken,
                    expiresAt: expiresAt,
                    refreshToken: refreshToken,
                    storeToken: false
                };
                return createNextResponse(200, "Success", tokenRes)
            } else {
                console.log("refresh token")
                //get new access token
                const data = await refreshAccessToken(refreshToken, accessToken);
                console.log("token data", data)

                let newTokenRes: StoreTokenRequest = {
                    accessToken: data.token,
                    expiresAt: data.expiresAt,
                    refreshToken: data.refreshToken,
                    storeToken: true
                };

                return createNextResponse(200, "Success", newTokenRes)
            }
        } else {
            return createNextResponse(400, "Cookie was empty")
        }

    } catch (e) {
        return createNextResponse(400, `An error occurred storing cookie: ${e}`)
    }
}

async function refreshAccessToken(refreshToken: string, token: string) {
    const request: RefreshTokenRequest = {
        refreshToken: refreshToken,
        token: token
    };

    const response = await adminApiClient
        .post<TokenResponse>('auth/refresh-token', `${JSON.stringify(request)}`);
    console.log("refresh token response", response.data)

    return response.data;
}
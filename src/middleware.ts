import {NextRequest, NextResponse} from "next/server";
import {setCookieOnResponseHeaders} from "@/helpers/tokenHelpers";
import {apiKey, internalBaseUrl} from "@/constants/appConstants";
import {getAccessToken} from "@/lib/token/tokenService";

export async function middleware(request: NextRequest) {
    if (request.url.includes('/api/')) {
        const clientApiKey = request.headers.get("x-api-key");
        if (clientApiKey !== apiKey) {
            return NextResponse.json("Unauthorized access");
        }
    }

    if (request.url.includes(`${internalBaseUrl}`)) {
        let response = await getAccessToken()
        if (response.statusCode === 200) {
            const tokenResponse = response.data;
            if (tokenResponse.storeToken) {
                let response = NextResponse.next();
                const {accessToken, expiresAt, refreshToken} = tokenResponse;

                setCookieOnResponseHeaders(accessToken, refreshToken, expiresAt, response);

                return response;
            }
        }

    }

    return NextResponse.next();
}
import {NextRequest, NextResponse} from "next/server";
import {setCookieOnResponseHeaders} from "@/helpers/tokenHelpers";
export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {accessToken, expiresAt, refreshToken} = requestBody;

        const response = NextResponse.json(
            {
                "data":"",
                "message":"Success",
                "statusCode":200
            },
            {status: 200});
        setCookieOnResponseHeaders(accessToken, refreshToken, expiresAt, response)

        return response;
    } catch (e) {
        return NextResponse.json(
            {error: `An error occurred storing cookie: ${e}`}, {status: 400}
        )
    }
}
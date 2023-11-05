import {NextResponse} from "next/server";
import {calculateTokenExpiration} from "@/helpers/dateHelpers";

const cookieName = process.env.COOKIE_NAME as string;

export function  setCookieOnResponseHeaders(accessToken: string, refreshToken: string, expiresAt: string, nextResponse: NextResponse<unknown>) {
    let cookieModel = {
        accessToken,
        refreshToken,
        expiresAt
    };

    nextResponse.cookies.set({
        name: `${cookieName}`,
        value: JSON.stringify(cookieModel),
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: calculateTokenExpiration(expiresAt),
        sameSite: "strict",
        path: "/",
    });

    console.log("token stored successfully")
}
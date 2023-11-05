import {NextRequest, NextResponse} from "next/server";
import {cookieName} from "@/constants/appConstants";

export async function POST(request: NextRequest) {
    try {
        request.cookies.clear()
        const nextResponse = NextResponse.json(
            {
                "message": "cleared access cookies",
                "statusCode":200
            },
            {status: 200});
        nextResponse.cookies.set({
            name: `${cookieName}`,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 0,
            expires:new Date(Date.now()),
            sameSite: "strict",
            path: "/",
        });

        return nextResponse;
    } catch (e) {
        return NextResponse.json(
            {error: `An error occurred deleting cookie: ${e}`}, {status: 400}
        )
    }
}
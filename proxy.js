import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(req) {
    const token = req.cookies.get("AccessToken")?.value;


    if (!token) {
        return NextResponse.json(
            { redirect: "/login" },
            { status: 401 }
        );
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.ACCESS_TOKEN_SECRET
        );

        await jwtVerify(token, secret);

        return NextResponse.next();
    } catch (error) {
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        );
    }
}


export const config = {
    matcher: [
        // "/:path*",
        "/Api/:path*",
        "/dashboard/:path*",
        "/profile/:path*",
        "/settings/:path*",
    ]
}
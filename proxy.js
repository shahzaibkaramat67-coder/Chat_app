import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(req) {
    const token = req.cookies.get("AccessToken")?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL("/login", req.url)
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
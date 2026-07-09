import { decode } from "punycode";
// import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { redirect } from "next/dist/server/api-utils";

const getToken = async (req) => {

    console.log("reqreq", req);


    const token = req.cookies.get("AccessToken")?.value

    if (!token) {
        return null
    }

    // const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
    const { payload } = await jwtVerify(token, secret)

    console.log("payload :", payload);


    if (!payload) {
        return null
    }

    const userId = payload.userId

    if (!userId) {
        return null
    }

    return userId


}

export default getToken
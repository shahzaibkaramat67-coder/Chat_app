import { NextResponse } from "next/server";
import User from "../../../model/User";
import bcrypt from "bcrypt";
import generateAccesstokenAndRefreshToken from "../../lib/auth"
import dbConnection from "../../lib/db";
import { date } from "zod";
// import { request } from "node:http";
// import { connect } from "http2";


export async function POST(req) {
    const body = await req.json()
    console.log("body", body);


    if (!body.email || !body.password) {
        return NextResponse.json(
            {
                ok: false,
                massage: "Invalid Credaintial"
            },
            {
                status: 400
            }
        )
    }


    const email = body.email.trim().toLowerCase()


    await dbConnection()

    const findUser = await User.findOne(
        {
            email
        }
    ).select("+password")

    console.log(`i have found the ${findUser}`);


    if (!findUser) {
        console.log("user not found");

        return NextResponse.json(
            {
                ok: false,
                massage: "User not found"
            },
            {
                status: 404
            }
        )
    }



    const isMatchPassword = await bcrypt.compare(body.password, findUser.password)

    console.log("isMatchPassword", isMatchPassword);


    if (!isMatchPassword) {
        return NextResponse.json(
            {
                ok: false,
                massage: "email or password not correct"
            },
            {
                status: 400
            }
        )

    }


    const { accessToken, refreshToken } = await generateAccesstokenAndRefreshToken(findUser._id)

    findUser.accessToken = accessToken
    findUser.accessTokenExpiry = Date.now() + 10 * 60 * 1000
    findUser.refreshToken = refreshToken
    findUser.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000

    await findUser.save()



    // return NextResponse.json(
    //     {
    //         ok: true,
    //         massage: "login successfully"
    //     },
    //     {
    //         status: 200
    //     }
    // )


    //     const response = NextResponse.redirect(
    //     new URL("/", req.url)

    // )

    const response = NextResponse.json({
        ok: true,
        message: "Login successful"
    });

    response.cookies.set("AccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60,
        path: "/"
    })
    response.cookies.set("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    })

    console.log("login route complete");
    return response





}
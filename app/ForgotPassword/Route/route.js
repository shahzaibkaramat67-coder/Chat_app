import { NextResponse } from "next/server"
import User from "../../../model/User"
import dbConnection from "../../lib/db"
import { request } from "node:http"
import { mail } from "../../lib/mail";
import crypto from "node:crypto";


export async function POST(req) {

    console.log(req.url);


    try {
        const body = await req.json()

        if (!body.email) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "email is required"
                },
                {
                    status: 401
                }
            )
        }

        await dbConnection()

        const email = body.email.trim().toLowerCase()

        const findUser = await User.findOne({ email })

        console.log("findUser", findUser);


        if (!findUser) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }



        const resetToken = crypto.randomBytes(32).toString("hex")
        const Token = crypto.createHash("sha256").update(resetToken).digest("hex")
        if (!Token) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "something went wrong"
                },
                {
                    status: 500
                }
            )
        }

        findUser.forgotPasswordToken = Token;
        findUser.forgotPasswordTokenExpiry = Date.now() + 5 * 60 * 1000
        await findUser.save();




        try {
            await mail(findUser.email, findUser.name, "Forgot", resetToken)
            return NextResponse.json({
                ok: true,
                message: "Reset password email sent"
            })

        } catch (error) {
            console.error(error);

        }

        const response = NextResponse.json(
            {
                ok: true,
                message: "check you email to reset the password`"
            },
            {
                status: 301
            }
        )

        // response.cookies.set("email", email, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "lax",
        //     path: "/",
        //     maxAge: 300
        // })
        return response


    } catch (error) {
        console.error("server error ", error)
        return NextResponse.json(
            {
                ok: false,
                message: "Internal Server Error "
            },
            {
                status: 500
            }
        )
    }




}
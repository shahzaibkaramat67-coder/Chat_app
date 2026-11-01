import { NextResponse } from "next/server"
import User from "../../../model/User"
import dbConnection from "../../lib/db"
import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcrypt";


// NextResponse

export async function POST(req) {
    // console.log("req.cookie.get", req.cookies().Al);



    // const cookieStore = await cookies();


    try {
        const body = await req.json()
        const { newpassword, confirmPassword, token } = body

        if (!newpassword || !confirmPassword) {
            return NextResponse.json(
                {
                    ok: false,
                    massage: "both fields are required"
                },
                {
                    status: 400
                }
            )
        }


        if (newpassword !== confirmPassword) {
            return NextResponse.json(
                {
                    ok: false,
                    massage: "password does not match"
                },
                {
                    status: 400
                }
            )

        }

        const hashToken = crypto.createHash("sha256").update(token).digest("hex")

        const confirmToken = await User.findOne(
            {
                forgotPasswordToken: hashToken,
                forgotPasswordTokenExpiry: { $gt: Date.now() }

            }
        )

        if (!confirmToken) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Token not found"
                },
                {
                    status: 401
                }
            )
        }

        confirmToken.forgotPasswordToken = undefined
        confirmToken.forgotPasswordTokenExpiry = undefined







        const hashPassword = await bcrypt.hash(newpassword, 12)
        if (!hashPassword) {
            return NextResponse.json(
                {
                    ok: false,
                    massage: "something went wrong"
                },
                {
                    status: 500
                }
            )
        }

        await dbConnection()

        const findUser = await User.findOneAndUpdate(
            {
                email: email.trim().toLowerCase()
            },
            {
                $set: {
                    password: hashPassword
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        // const findUser = await User.aggregate([
        //     {
        //         $match: { email: "email" }
        //     },
        //     {
        //         $set: { "password": hashPassword }
        //     }
        // ])

        if (!findUser) {
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

        console.log("findUser", findUser);
        return NextResponse.json(
            {
                ok: true,
                message: "Password updated successfully.",
            },
            { status: 200 }
        );

        // Remove email cookie after successful reset
        // response.cookies.delete("email");

        // 

        // 
        // return NextResponse.redirect(
        //     new URL("/login", req.URL)
        // )
    } catch (error) {
        console.error("Internal server error :", error)
        return NextResponse.json(
            {
                ok: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        )
    }


}
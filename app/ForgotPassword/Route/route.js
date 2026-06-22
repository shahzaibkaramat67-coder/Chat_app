import { NextResponse } from "next/server"
import User from "../../../model/User"
import dbConnection from "../../lib/db"
import { request } from "node:http"
import { mail } from "../../lib/mail";


export async function POST(req) {

    console.log(req.url);
    

    const body = await req.json()

    if (!body.email) {
        return NextResponse.json(
            {
                ok: false,
                massage: "no Data input"
            },
            {
                status: 401
            }
        )
    }

    await dbConnection()

    const email = body.email.trim().toLowerCase()

    const findUser = await User.findOne({email})

    console.log("findUser", findUser);
    

    if (!findUser) {
         return NextResponse.json(
            {
                ok: false,
                massage: "User not found"
            },
            {
                status: 401
            }
        )
    }


    try {
        await mail(findUser.email, findUser.name, "Forgot")
         return NextResponse.json({
        ok: true,
        message: "Reset password email sent"
    })

    } catch (error) {
        console.error(error);
        
    }

     


    // return NextResponse.redirect(
    //     new URL("/updatePassword", request.URL)
    // )



}
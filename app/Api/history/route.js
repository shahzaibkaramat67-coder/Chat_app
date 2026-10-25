import { env } from "node:process";
import { NextResponse } from "next/server";
import Chat from "../../../model/Chat";
import dbConnection from "../../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import { process } from "zod/v4/core";
import { jwtVerify } from "jose";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("AccessToken")?.value
    if (!token) {
        return NextResponse(
            { redirect: "/login" },
            { status: 401 }
        )
    }



    // console.log("Process exists:", typeof process);
    // console.log("Env exists:", typeof env);
    // console.log("Secret configured:", Boolean(env.ACCESS_TOKEN_SECRET));

    // const secretValue = env.ACCESS_TOKEN_SECRET;
    // console.log("secretValue :", secretValue)

    // if (!secretValue) {
    //     throw new Error("ACCESS_TOKEN_SECRET is missing");
    // }

    // const secret1 = new TextEncoder().encode(secretValue);
    // const { payload } = await jwtVerify(token, secret1);
    const secret = new TextEncoder().encode(
        env.ACCESS_TOKEN_SECRET
    );

    const user = await jwtVerify(token, secret);

    console.log("user :", user);
    await dbConnection()

    const allChats = await Chat.find({ userId: user.payload.userId })




    console.log("allChats :", allChats);



    if (allChats) {

        const data = allChats.map(element => ({
            fullChatId: element.fullChatId,
            title: element.title
        }));

        console.log("data :", data);


        return NextResponse.json(
            {
                ok: true,
                History: data
            }
        )
    }

}
import { NextResponse } from "next/server";
import Chat from "../../../model/Chat";
import getToken from "../../lib/verify";

export async function POST(req) {



    try {
        const body = await req.json()

        const { newChatId } = body

        console.log("newChat id :", newChatId);
        if (!newChatId) {
            return NextResponse.json(
                {
                    ok: true,
                    message: "something went wrong"
                },
                {
                    status: 500
                }
            )
        }

        const userId = await getToken(req)
        if (!userId) {
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



        const newChat = await Chat.create({
            userId,
            fullChatId: newChatId,
            title: "New Chat"
        })
        if (!newChat) {
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

        return NextResponse.json(
            {
                ok: true,
                message: "New Chat create Successfull",
                newChatId: newChat.fullChatId
            },
            {
                status: 200
            }
        )



    } catch (error) {
        console.error("something went wrong", error);

    }


}
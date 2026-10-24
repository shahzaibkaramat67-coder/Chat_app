import { NextResponse } from "next/server";
import Chat from "../../../model/Chat";

export async function GET() {
    const allChats = await Chat.find().countDocuments()
    console.log("allChats", allChats)


    if (allChats) {
        return NextResponse.json(
            {
                ok: true
            },
            {
                chats: allChats
            }
        )
    }

}
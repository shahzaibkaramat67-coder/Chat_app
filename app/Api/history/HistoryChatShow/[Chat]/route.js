import { NextResponse } from "next/server";
import Message from "../../../../../model/massage"

export async function GET(req, { params }) {
    console.log("chat bibw  hw1 dwiubeui feif bebfeh");


    try {
        const { Chat } = await params

        console.log("id :", Chat);


        const chatIdForHistory = await Message.findOne({ fullChatId: Chat })
        console.log("chatIdForHistory :", chatIdForHistory);
        if (!chatIdForHistory) {
            return NextResponse.json(
                { ok: true, message: "no chat found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                ok: true,
                messages: chatIdForHistory
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                messages: "server error"
            },
            {
                status: 500
            }
        )
    }



}
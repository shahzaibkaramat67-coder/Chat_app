import { NextResponse } from "next/server";
import Chat from "../../../../../model/Chat";
import Message from "../../../../../model/massage";

export async function GET(req, { params }) {
    console.log("chat bibw  hw1 dwiubeui feif bebfeh");


    try {
        const { chat } = await params

        console.log("id :", chat);


        const chatIdForHistory = await Chat.findOne({ fullChatId: chat })
        if (!chatIdForHistory) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "No Chat Found"
                },
                {
                    status: 401
                }
            )
        }
        console.log("chatIdForHistory hvhjvuvhvhvuivhvih:", chatIdForHistory);
        console.log("chatIdForHistory hvhjvuvhvhvuivhvih:", chatIdForHistory.fullChatId);

        const message = await Message.find({ chatId: chatIdForHistory._id }).sort({ createdAt: 1 })
        console.log("All message from Chat:", message);
        return NextResponse.json(
            {
                okay: true,
                messageList: message
            },
            {
                status: 200
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
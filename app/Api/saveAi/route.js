import { json } from "stream/consumers";
import Message from "../../../model/massage";
import { NextResponse } from "next/server";
import dbConnection from "../../lib/db";
import Chat from "../../../model/Chat";

export async function POST(req) {


  try {
    await dbConnection()


    const body = await req.json()
    console.log("body", body);

    const { aiMessageID, role, content, fullChatId } = body

    const fullChatfound = await Chat.findOne({ fullChatId })

    console.log("fullChatfound :", fullChatfound);


    if (!fullChatfound) {
      return NextResponse.json(
        {
          ok: false,
          message: "No Chat ID Found",
        },
        {
          status: 401
        }
      )

    }


    await Message.create({
      fullChatId: fullChatfound._id,
      messageID: aiMessageID,
      role,
      content
    })


    return NextResponse.json({ ok: true }, { status: 200 })

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "not data store in db from Ai" }, { status: 500 })

  }


}
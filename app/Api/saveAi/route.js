import { json } from "stream/consumers";
import Message from "../../../model/massage";
import { NextResponse } from "next/server";
import dbConnection from "../../lib/db";

export async function POST(req) {


  try {
    await dbConnection()


    const body = await req.json()
    console.log("body", body);

    const { role, message } = body


    await Message.create({
      role,
      content: message
    })


    return NextResponse.json({ success: "true" }, { status: 200 })

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "not data store in db from Ai" }, { status: 500 })

  }


}
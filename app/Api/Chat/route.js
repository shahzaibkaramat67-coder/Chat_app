import React from 'react'
import { NextResponse } from 'next/server'
import { json } from 'stream/consumers';
import dbConnection from '../../lib/db';
// import { create } from 'domain';
import AiFunction from '../../lib/Ai';
// import Chat from '../../../model/Chat';
import Message from '../../../model/massage';
import { error } from 'console';
// import { verify } from 'crypto';
import jwt from "jsonwebtoken"
import { TokenClass } from 'typescript';
import Chat from '../../../model/Chat';
import { title } from 'process';
import { NEXT_CACHE_ROOT_PARAM_TAG_ID } from 'next/dist/lib/constants';
import getToken from '../../lib/verify';


export async function POST(req) {

  console.log("here CHat route is starting");


  try {

    await dbConnection()

    const body = await req.json();
    console.log("here CHat route body", body);
    const user = await getToken(req)
    console.log("this is from CHat route body", user);

    const { text, userId } = body;
    console.log("this is also from chat route", text);

    const chatId = await Chat.findOne({ userId })

    console.log("chatId", chatId);


    if (!chatId) {

      const saveUserData = await Chat.create({
        userId: user._id,
        chatId,
        title: title.slice(0, 30)

      })
    } else {

      const saveUserData = await Message.create({
        chatId: chat_id,
        role: "user",
        content: text
      })

    }










    console.log("this is from chat route saveUserData", saveUserData);



    const ApiReply = await AiFunction(text)
    console.log("this is from chat route cmdApiReply", ApiReply);


    if (!ApiReply) {
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }


    const saveAIData = await Message.create({
      role: "assistant",
      message: ApiReply

    })



    return new NextResponse(ApiReply.body, {
      headers: { "Content-Type": "text/plain" }
    })

    // return NextResponse.json({ 
    //   ApiReply.body
    //  })


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }

}



export async function GET() {
  try {

    await dbConnection();

    const message = await Message.find().sort({ createdAt: 1 });

    // console.log("message", message);


    return NextResponse.json({ messages: message })


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "not chat found" }, { status: 401 })

  }
}





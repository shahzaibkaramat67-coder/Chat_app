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
import { model } from '../../lib/modelOption';



export async function POST(req) {

  console.log("here CHat route is starting");


  try {

    await dbConnection()

    const body = await req.json();


    console.log("here CHat route body", body);
    const user = await getToken(req)
    if (!user) {
      return NextResponse.json(
        { status: 401 },
        { redirect: "/login" }
      )

    }
    console.log("this is from CHat route body", user);



    const { text, userMessageID, fullChatId, selectOPtion } = body;
    console.log("this is also from chat route", text);
    console.log("selectOPtion :", selectOPtion);

    const fullChat = await Chat.findOne({ fullChatId })

    console.log("chatId", fullChat);


    if (!fullChat) {

      const createChat = await Chat.create({
        userId: user,
        fullChatId: fullChatId,
        title: "new Chat"

      })

      console.log("createChat", createChat);


      const createMessageForChat = await Message.create({
        fullChatId: fullChatId,
        messageID: userMessageID,
        role: "user",
        content: text
      })

    } else {

      const saveUserData = await Message.create({
        fullChatId: fullChatId,
        messageID: userMessageID,
        role: "user",
        content: text
      })

    }

    // console.log("this is from chat route saveUserData", saveUserData);

    const choseModel = model[selectOPtion]

    if (!choseModel) {
      return NextResponse.json({ error: "Select your model" }, { status: 404 })
    }

    console.log("model :", choseModel);


    const result = await AiFunction(text, choseModel.model)
    console.log("this is from chat route result", result);

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            controller.enqueue(
              new TextEncoder().encode(chunk.text())
            )
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    })


    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
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





import { NextResponse } from "next/server";
import Chat from "../../../model/Chat";

export async function GET(){
    const allChats = await Chat.find()
    
    if(allChats){
        return NextResponse.json(
            {
                ok : true
            },
            {
                chats : allChats
            }
        )
    }

}
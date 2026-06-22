"use client";

import Sidebar from "@/components/sidbar";
import Image from "next/image";
import icons from "@/Assets/asset";
import Popup from "@/components/popup"
import { useState } from "react";
import Profile from "@/components/profile"
import Threedot from "@/components/threedot";
import Chat from "@/components/newChat";
import Search from "@/components/search"
import Project from "@/components/project";
import UserInputSection from "@/app/chat/UserInput/page"
import ChatMessages from "@/app/chat/message/page"
import { useEffect } from "react";
import { NextResponse } from "next/server";
// import UserInputShowSection from "@/app/chat/UserInputShow/page"

export default function Home() {
  const [expand, setExpand] = useState(true);
  const [popup, setpopup] = useState(false)
  const [profile, setprofile] = useState(false)
  const [threedot, setthreedot] = useState(false)
  const [chat, setChat] = useState(false)
  const [search, setsearch] = useState(false)
  const [project, setproject] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setloading] = useState(false)

  console.log("this is from mian page messages", messages);

   useEffect(() => {
    console.log("UPDATED messages:", messages);
  }, [messages]);

   useEffect(()=>{
     const getMessage = async ()=>{
      try {
        const res = await fetch("/Api/Chat")
        const data =await res.json()
        setMessages( data.messages || [] )
      } catch (error) {
        console.error("Fetch error:", error);
        
      }
     }

     getMessage()

}, [])







  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        expand={expand}
        setExpand={setExpand}
        setprofile={setprofile}
        setChat={setChat}
        setsearch={setsearch}
        setproject={setproject}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col relative">

        {/* 🔝 Top Navbar */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-white">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setExpand(!expand)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Image
              src={icons.barsSolidFull}
              alt="menu"
              width={18}
              height={18}
            />
          </button>

          {/* Right Icons */}
          <div className="flex gap-2 ml-auto">
            <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer">
              <Image
                onClick={() => setpopup(!popup)}
                src={icons.sharesolidfull}
                alt="share"
                width={18}
                height={18}
              />
            </div>

            <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer">
              <Image
                onClick={() => setthreedot(!threedot)}
                src={icons.ellipsisSolidFull}
                alt="menu"
                width={18}
                height={18}
              />
            </div>
          </div>
        </div>

        {/* 🔘 Overlays / Modals */}
        {threedot && <Threedot />}
        {chat && <Chat setChat={setChat} />}
        {search && <Search setSearch={setsearch} />}
        {project && <Project setproject={setproject} />}
        {popup && <Popup popup={popup} setpopup={setpopup} />}
        {profile && <Profile setprofile={setprofile} />}

        {/* 💬 Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-3xl w-full mx-auto my-auto">
            <ChatMessages 
            messages={messages}
             />
          </div>

        </div>

        {/* ✍️ Input Section (Fixed Bottom Feel) */}

        <div className="h">
          <UserInputSection
            setmessages={setMessages}
            messages={messages}
            loading={loading}
            setloading={setloading}
          />
        </div>


      </div>
    </div>
  );
}
"use client";

import Sidebar from "@/components/sidbar";
import Image from "next/image";
import icons from "@/Assets/asset";
import Popup from "@/components/popup";
import { useState, useEffect } from "react";
import Profile from "@/components/profile";
import Threedot from "@/components/threedot";
import Chat from "@/components/newChat";
import Search from "@/components/search";
import Project from "@/components/project";
import UserInputSection from "@/app/chat/UserInput/page";
import ChatMessages from "@/app/chat/message/page";

export default function Home() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [draftChatId, setDraftChatId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [expand, setExpand] = useState(true);
  const [popup, setpopup] = useState(false);
  const [profile, setprofile] = useState(false);
  const [threedot, setthreedot] = useState(false);
  // const [chat, setChat] = useState(false);
  const [search, setsearch] = useState(false);
  const [project, setproject] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [refreshTrigerHistory, setRefreshTrigerHistory] = useState(0);
  // const [error, setError] = useState("")

  // 1. Restore conversation after page refresh
  useEffect(() => {
    async function restoreChat() {
      try {
        const saveActiveChatId = sessionStorage.getItem("activeChatId")
        const saveDaftChatId = sessionStorage.getItem("draftChatId")

        if (saveActiveChatId) {
          setActiveChatId(saveActiveChatId)
          setDraftChatId(null)

          const res = await fetch(`/Api/history/HistoryChatShow/${saveActiveChatId}`)
          if (res.ok) {
            const data = await res.json()
            setMessages(data.messageList || [])
          } else {
            console.error("Failed to response :", res.status)
            setMessages([])
          }
        } else if (saveDaftChatId) {
          setDraftChatId(saveDaftChatId)
          setActiveChatId(null)
          setMessages([])
        } else {
          const newDaftChatUUIDId = crypto.randomUUID()
          setDraftChatId(newDaftChatUUIDId)
          setActiveChatId(null)
          setMessages([])

          sessionStorage.setItem("draftChatId", newDaftChatUUIDId)
        }
      } catch (error) {
        console.error("chat restoration error :", error)
      } finally {
        setIsInitialized(true)

      }


    }
    restoreChat()
  }, []);

  // 2. Create a new empty conversation

  function hendelNewChat() {
    const newChatId = crypto.randomUUID()
    setActiveChatId(null)
    setDraftChatId(newChatId)
    setMessages([])

    sessionStorage.removeItem("activeChatId")
    sessionStorage.setItem("draftChatId", newChatId)
  }


  const handleHistoryRefresh = () => {
    setRefreshTrigerHistory((prev) => prev + 1);
  };


  function handleChatCreated(newMongoChatId: string) {
    setActiveChatId(newMongoChatId);
    setDraftChatId(null);

    sessionStorage.setItem("activeChatId", newMongoChatId);
    sessionStorage.removeItem("draftChatId");
  }






  const hendelNewChatCreate = async () => {
    let ChatId = activeChatId;

    if (!ChatId) {
      const newChatApi = await fetch(`/Api/newChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newChatId: draftChatId })
      });
      console.log("newChatApi :", newChatApi);
      const data = await newChatApi.json();
      if (!newChatApi.ok) {
        console.log("API response:", data.message);
        return
      }
      // newChat = data.newChatId
      // console.log("API response newChat:", newChat);
      if (!newChatApi.ok) {
        console.error("New chat creation failed:", data.message);
        return;
      }

      ChatId = data.newChatId

    }


  }


  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
      <Sidebar
        expand={expand}
        setExpand={setExpand}
        setprofile={setprofile}
        setsearch={setsearch}
        setproject={setproject}
        onSelectChat={setMessages}
        refreshTrigerHistory={refreshTrigerHistory}
        onNewChat={hendelNewChat}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

      <div className="relative flex flex-1 min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpand(!expand)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 md:hidden"
            >
              <Image src={icons.barsSolidFull} alt="menu" width={18} height={18} />
            </button>

            <div className="hidden items-center gap-3 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200 md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Omni AI Studio
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setpopup(!popup)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <Image src={icons.sharesolidfull} alt="share" width={16} height={16} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setthreedot(!threedot)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <Image src={icons.ellipsisSolidFull} alt="more" width={18} height={18} />
            </button>
          </div>
        </header>

        {threedot && <Threedot />}
        {/* {chat && <Chat setChat={setChat} />} */}
        {search && <Search setSearch={setsearch} />}
        {project && <Project setproject={setproject} />}
        {popup && <Popup popup={popup} setpopup={setpopup} />}
        {profile && <Profile setprofile={setprofile} />}

        <main className="flex-1 overflow-y-auto px-3 py-5 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-4xl">
            <ChatMessages messages={messages} />
          </div>
        </main>

        <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <UserInputSection
            setmessages={setMessages}
            loading={loading}
            setloading={setloading}
            onHistoryrefresh={handleHistoryRefresh}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            draftChatId={draftChatId}
            onChatCreated={handleChatCreated}

          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect,useCallback, useState } from "react";
import ChatMessages from "../app/chat/message/page"

function History({ expand, onSelectChat, refreshTrigerHistory }) {
  const [history, setHistory] = useState([]);
  const [chatId, setChatId] = useState("");
  // const [chatIdMessage, setChatIdMessae] = useState([])


  console.log("history :", history);

   const fetchHistory =  useCallback(async() => {
      try {
        const res = await fetch("/Api/history",{
         cache: "no-store",
        })

        if (!res.ok) {
          console.log("Failed to fetch chat history");
           return;
        }

        const result = await res.json();
        setHistory(result.History)
        
        // setHistory(Array.isArray(data?.messages) ? data.messages : []);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    }, []);


  

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshTrigerHistory]);



  const chatIdShow = async (chat) =>{
    const res = await fetch(`/Api/history/HistoryChatShow/${chat}`)
    if (res.ok) {
      const data =await res.json()
      if(data){
        console.log("now data access data.messageList :", data.messageList);
        
        onSelectChat(data.messageList)
      }else{

        console.log("this is error data.messages :", data.messages);
      }
     
      
    }
  }
  

  return (
    <div className={`${expand ? "block" : "hidden"} px-4 mt-8`}>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        History
      </h2>

      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div
              key={item.fullChatId || index}
              onClick={()=> chatIdShow(item.fullChatId)}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black cursor-pointer text-sm text-white-700"
            >
              {item.title || item.content || `History ${index + 1}`}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 rounded-lg text-sm text-gray-400">
            No history yet
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
import React, { useEffect, useRef, useState } from "react";




function ChatMessages({ messages = [] }) {

  console.log("messages from chatmessage", messages);


  const BottomRef = useRef(null)

  useEffect(() => {
    BottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col overflow-auto gap-3 px-6 py-4">

      {messages.map((msg, index) => (

        <div
          key={index}
          className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"
            }`}
          >

         <div
  className={`w-fit  wrap-break-word p-4 rounded-xl shadow-sm border text-sm ${
    msg.role === "user"
      ? "bg-white max-w-[70%]  text-black ml-auto"
      : "bg-white max-w-full text-black text-left"
  }`}
>
            {msg.loading ? (
              <div className="flex gap-1 items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-150">●</span>
                <span className="animate-pulse delay-300">●</span>
              </div>
            ) : (
              msg.content
            )}
          </div>
               <div
      className={`w-fit flex gap-2 text-black cursor-pointer mt-1 ${
        msg.role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
           
               <span>a</span>
             <span>b</span>
             <span>c</span>
            </div>
        </div>

      ))}





      <div ref={BottomRef} ></div>

    </div>
  );
}

export default ChatMessages;
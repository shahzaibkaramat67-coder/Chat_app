"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function UserInputSection({ messages = [], setmessages, loading, setloading }) {
  const [input, setInput] = useState("");
  const route = useRouter();

  const sendHendeler = async () => {
    if (!input.trim()) return null;

    const userInput = input.trim();
    const userMessageID = crypto.randomUUID();
    const aiMessageID = crypto.randomUUID();
    const fullChatId = crypto.randomUUID();

    setmessages((prev) => [
      ...prev,
      { id: userMessageID, fullChatId, role: "user", content: userInput },
    ]);

    setInput("");
    setloading(true);

    setmessages((prev) => [
      ...prev,
      { id: aiMessageID, fullChatId, role: "assistant", content: "", loading: true },
    ]);

    const res = await fetch("/Api/Chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userInput, userMessageID, fullChatId }),
    });

    if (res.status === 401) {
      const refreshToken = await fetch("/Api/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshToken.ok) {
        return route.push("/login");
      }

      return route.push("/login");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (let line of lines) {
        try {
          const json = JSON.parse(line);

          if (json.response) {
            fullText += json.response;

            setmessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageID
                  ? { ...msg, fullChatId, content: fullText, loading: false }
                  : msg
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    setloading(false);

    await fetch("/Api/saveAi", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aiMessageID,
        role: "assistant",
        content: fullText,
        fullChatId,
      }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-5">
      <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20 md:px-4">
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendHendeler();
            }}
            placeholder="Type your message..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none md:text-base"
          />

          <button
            onClick={sendHendeler}
            disabled={loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-lg font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            ➤
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            {["A", "B", "C"].map((letter, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-[10px] font-semibold text-amber-200"
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {loading ? <span>Thinking…</span> : <span>Ready</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInputSection;














// import React from 'react'

// function UserInputSection() {
//   return (
//     <div className="flex flex-col items-center justify-center flex-1 px-6  relative group">

//           {/* <div className="bg-amber-500 w-3xl">
//             <div>
//               <p className="text-black">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde molestiae temporibus nam sunt tenetur dolorum veritatis placeat, alias eaque. Magni velit sed magnam ducimus similique consequatur ab eligendi, reprehenderit officia?</p>
//             </div>
//           </div> */}

//           <h1 className="text-4xl font-bold text-gray-800">
//             Hi, How Are You?
//           </h1>

//           <div className="w-full max-w-3xl  bg-white shadow-sm border rounded-xl ">

//             <p className="text-gray-700 text-sm">
//               Your content goes here...
//             </p>

//             <div className="flex items-center justify-between mt-4">

//               <div className="flex gap-1 items-center ">
//                 <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
//                 <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
//                 <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
//               </div>

//              <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">E</div>

//             </div>
//           </div>
//         </div>
//   )
// }

// export default UserInputSection
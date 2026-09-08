import React, { useEffect, useRef } from "react";

function ChatMessages({ messages = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-full flex-col gap-4 px-2 py-4 md:px-0">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-12 pt-10">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-2xl text-slate-950">
              ✦
            </div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">
              Hi, how can I help today?
            </h1>
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Ask a question, brainstorm an idea, or continue a conversation.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-7 shadow-lg md:max-w-[75%] ${
                msg.role === "user"
                  ? "border-amber-300/40 bg-linear-to-br from-amber-400 to-orange-500 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-100"
              }`}
            >
              {msg.loading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-200" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms]" />
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>

            <div
              className={`mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span>{msg.role === "user" ? "You" : "AI"}</span>
            </div>
          </div>
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
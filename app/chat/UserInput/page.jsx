
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UserInputSection = ({
  setmessages,
  loading,
  setloading,
  onHistoryrefresh,
  activeChatId,
  onChatCreated,
  draftChatId,
}) => {
  const router = useRouter();

  const [error, seterror] = useState("");
  const [input, setInput] = useState("");
  const [selectOption, setSelectOption] = useState("")

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!input.trim() || loading) return;

    const userInput = input.trim();

    const userMessageID = crypto.randomUUID();
    const aiMessageID = crypto.randomUUID();

    let ChatId = activeChatId;

    seterror("");
    setloading(true);

    try {
      // STEP 1: Create MongoDB chat if this is a new chat.
      if (!ChatId) {
        if (!draftChatId) {
          seterror("Draft chat ID is missing.");
          return;
        }

        const newChatApi = await fetch("/Api/newChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newChatId: draftChatId,
          }),
        });

        const data = await newChatApi.json();

        if (newChatApi.status === 401) {
          router.push("/login")
          return
        }

        if (!newChatApi.ok) {
          seterror(data.message || "Failed to create a new chat.");
          return;
        }

        // Actual MongoDB chat ID.
        ChatId = data.newChatId;

        if (!ChatId) {
          seterror("MongoDB chat ID was not returned.");
          return;
        }

        // Update parent component.
        onChatCreated?.(ChatId);
      }

      console.log("Actual MongoDB ChatId:", ChatId);

      // STEP 2: Add user message to UI.
      setmessages((prev) => [
        ...prev,
        {
          id: userMessageID,
          fullChatId: ChatId,
          role: "user",
          content: userInput,
        },
      ]);

      // STEP 3: Add empty AI message.
      setmessages((prev) => [
        ...prev,
        {
          id: aiMessageID,
          fullChatId: ChatId,
          role: "assistant",
          content: "",
          loading: true,
        },
      ]);

      setInput("");

      // STEP 4: Send user message to AI API.
      const res = await fetch("/Api/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userInput,
          userMessageID,
          fullChatId: ChatId,
          selectOption,
        }),
      });

      // STEP 5: Handle authentication.
      if (res.status === 401) {
        const refreshToken = await fetch("/Api/refresh-token", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshToken.ok) {
          router.push("/login");
        } else {
          seterror("Session refreshed. Please send your message again.");
        }

        return;
      }

      // STEP 6: Handle API errors.
      if (!res.ok) {
        const data = await res.json();

        seterror(
          data.message || "Failed to get an AI response."
        );

        return;
      }

      if (!res.body) {
        seterror("No data received from AI.");
        return;
      }

      // STEP 7: Read streaming AI response.
      let fullText = "";

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        fullText += chunk;

        setmessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageID
              ? {
                  ...msg,
                  fullChatId: ChatId,
                  content: fullText,
                  loading: true,
                }
              : msg
          )
        );
      }

      fullText += decoder.decode();

      // STEP 8: Mark AI response as complete.
      setmessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageID
            ? {
                ...msg,
                content: fullText,
                loading: false,
              }
            : msg
        )
      );

      // STEP 9: Save AI response in MongoDB.
      const saveAI = await fetch("/Api/saveAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aiMessageID,
          role: "assistant",
          content: fullText,
          fullChatId: ChatId,
        }),
      });

      if (!saveAI.ok) {
        const data = await saveAI.json();

        seterror(
          data.message || "Failed to save the AI response."
        );

        return;
      }

      // STEP 10: Refresh sidebar history.
      onHistoryrefresh?.();

    } catch (err) {
      console.error("Error sending message:", err);

      seterror("Something went wrong. Please try again.");

    } finally {
      setloading(false);

      setmessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageID
            ? {
                ...msg,
                loading: false,
              }
            : msg
        )
      );
    }
  };




  

return (
    <div className="flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-5">
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20 md:px-4">
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type your message..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none md:text-base"
          />

          <button
            onClick={handleSendMessage}
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
            {/* {loading ? <span>Thinking…</span> : <span>Ready</span>} */}
            <select value={selectOption} required onChange={(e) => setSelectOption(e.target.value)} id="model">
              <option value="default">Choose model</option>
              <option value="gemini-2.5-flash-lite">gemini 2.5 flash-lite (free)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash (free)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}


export default UserInputSection;











    
    // "use client";
    
    // import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";
    // import { useRouter } from "next/navigation";
    // import React, { useState } from "react";
    
    // function UserInputSection({ setmessages, loading, setloading, onHistoryrefresh }) {
    //   const [input, setInput] = useState("");
    //   const [fullChatId, setFullChatId] = useState(null)
    //   const [selectOPtion, setSelectOPtion] = useState("");
    //   const [error, seterror] = useState("")
    //   const route = useRouter();
    
    
    
    //   console.log("selectOPtion :", selectOPtion)
    //   const sendHendeler = async () => {
    //     if (!input.trim()) return null;
    
    //     const userInput = input.trim();
    //     const userMessageID = crypto.randomUUID();
    //     const aiMessageID = crypto.randomUUID();
    //     // const fullChatId = ;
    
    
    //     // Reuse the current chat ID, or create one for the first message.
    //     const ChatId = fullChatId || crypto.randomUUID();
    
    //     if (!fullChatId) {
    //       setFullChatId(ChatId);
    //     }
    
    
    //     console.log("ChatId :", ChatId);
    
    
    //     setmessages((prev) => [
    //       ...prev,
    //       { id: userMessageID, fullChatId: ChatId, role: "user", content: userInput },
    //     ]);
    
    //     setInput("");
    //     setloading(true);
    
    //     setmessages((prev) => [
    //       ...prev,
    //       { id: aiMessageID, fullChatId: ChatId, role: "assistant", content: "", loading: true },
    //     ]);
    
    //     const res = await fetch("/Api/Chat", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ text: userInput, userMessageID, fullChatId: ChatId, selectOPtion }),
    //     });
    
    //     let fullText = "";
    //     if (res.status === 401) {
    //       const refreshToken = await fetch("/Api/refresh-token", {
    //         method: "POST",
    //         credentials: "include",
    //       });
    
    //       if (refreshToken.ok) {
    //         return route.push("/login");
    //       }
    
    //       return route.push("/login");
    //     }
    //     if (!res.ok) {
    //       const data = await res.json()
    //       seterror(data.message)
    //       setloading(false);
    //       return
    
    //     }
    
    //     if (!res.body) {
    //       seterror("No Data Recieve From AI")
    //       setloading(false);
    //       return
    //     } else {
    //       const reader = res.body.getReader();
    //       const decoder = new TextDecoder();
    
    //       while (true) {
    //         const { value, done } = await reader.read();
    //         if (done) break;
    
    //         const chunk = decoder.decode(value, { stream: true });
    //         fullText += chunk
    //         setmessages((prev) =>
    //           prev.map((msg) =>
    //             msg.id === aiMessageID
    //               ? { ...msg, fullChatId: ChatId, content: fullText, loading: false }
    //               : msg
    //           )
    //         );
    //       }
    //       setloading(false)
    //     }
    
    
    
    //     const saveAI = await fetch("/Api/saveAi", {
    //       method: "post",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         aiMessageID,
    //         role: "assistant",
    //         content: fullText,
    //         fullChatId: ChatId
    //       }),
    //     });
    //     if (!saveAI.ok) {
    //       const data = await saveAI.json()
    //       seterror(data.message)
    //     } else {
    //       onHistoryrefresh?.();
    //     }
    
  
  //  "use client";
      
  // import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";
  // import { useRouter } from "next/navigation";
  // import React, { useState } from "react";
  
      
  
  
  
  
  // function UserInputSection({
  // setmessages, loading, setloading, onHistoryrefresh, activeChatId, setActiveChatId
  // }) {
  //     const [input, setInput] = useState("");
  //       // const [fullChatId, setFullChatId] = useState(null)
  //       const [selectOPtion, setSelectOPtion] = useState("");
  //       const [error, seterror] = useState("")
  //       const route = useRouter();
    
  
  
  //   console.log("selectOPtion:", selectOPtion);
  
  //   const sendHendeler = async () => {
  //     if (!input.trim()) return;
  
  //     const userInput = input.trim();
  //     const userMessageID = crypto.randomUUID();
  //     const aiMessageID = crypto.randomUUID();
  
  //     // Reuse the current chat ID or create one for a new chat.
  //     const ChatId = activeChatId || crypto.randomUUID();
  
  //     if (!activeChatId) {
  //       setActiveChatId(ChatId);
  //     }
  
  //     console.log("ChatId:", ChatId);
  
  //     // Clear any previous error.
  //     seterror("");
  
  //     // Add the user's message.
  //     setmessages((prev) => [
  //       ...prev,
  //       {
  //         id: userMessageID,
  //         fullChatId: ChatId,
  //         role: "user",
  //         content: userInput,
  //       },
  //     ]);
  
  //     // Add an empty AI message while waiting for the response.
  //     setmessages((prev) => [
  //       ...prev,
  //       {
  //         id: aiMessageID,
  //         fullChatId: ChatId,
  //         role: "assistant",
  //         content: "",
  //         loading: true,
  //       },
  //     ]);
  
  //     setInput("");
  //     setloading(true);
  
  //     try {
  //       // Send the user's message to the AI API.
  //       const res = await fetch("/Api/Chat", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           text: userInput,
  //           userMessageID,
  //           fullChatId: ChatId,
  //           selectOPtion,
  //         }),
  //       });
  
  //       // Handle authentication errors.
  //       if (res.status === 401) {
  //         const refreshToken = await fetch("/Api/refresh-token", {
  //           method: "POST",
  //           credentials: "include",
  //         });
  
  //         // Preserve your existing redirect behavior.
  //         if (refreshToken.ok) {
  //           route.push("/login");
  //           return;
  //         }
  
  //         route.push("/login");
  //         return;
  //       }
  
  //       // Handle API errors.
  //       if (!res.ok) {
  //         const data = await res.json();
  //         seterror(data.message || "Failed to get an AI response.");
  //         return;
  //       }
  
  //       // Ensure the response body exists.
  //       if (!res.body) {
  //         seterror("No data received from AI.");
  //         return;
  //       }
  
  //       // Read the streaming AI response.
  //       let fullText = "";
  //       const reader = res.body.getReader();
  //       const decoder = new TextDecoder();
  
  //       while (true) {
  //         const { value, done } = await reader.read();
  
  //         if (done) break;
  
  //         const chunk = decoder.decode(value, { stream: true });
  //         fullText += chunk;
  
  //         setmessages((prev) =>
  //           prev.map((msg) =>
  //             msg.id === aiMessageID
  //               ? {
  //                   ...msg,
  //                   fullChatId: ChatId,
  //                   content: fullText,
  //                   loading: true,
  //                 }
  //               : msg
  //           )
  //         );
  //       }
  
  //       // Flush any remaining decoded characters.
  //       fullText += decoder.decode();
  
  //       // Mark the AI response as complete.
  //       setmessages((prev) =>
  //         prev.map((msg) =>
  //           msg.id === aiMessageID
  //             ? {
  //                 ...msg,
  //                 content: fullText,
  //                 loading: false,
  //               }
  //             : msg
  //         )
  //       );
  
  //       // Save the completed AI response.
  //       const saveAI = await fetch("/Api/saveAi", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           aiMessageID,
  //           role: "assistant",
  //           content: fullText,
  //           fullChatId: ChatId,
  //         }),
  //       });
  
  //       if (!saveAI.ok) {
  //         const data = await saveAI.json();
  //         seterror(data.message || "Failed to save the AI response.");
  //         return;
  //       }
  
  //       // Refresh chat history after successful saving.
  //       onHistoryrefresh?.();
  //     } catch (err) {
  //       console.error("Error sending message:", err);
  //       seterror("Something went wrong. Please try again.");
  //     } finally {
  //       // Always stop loading, even when an error occurs.
  //       setloading(false);
  
  //       // Ensure the AI message is no longer marked as loading.
  //       setmessages((prev) =>
  //         prev.map((msg) =>
  //           msg.id === aiMessageID
  //             ? { ...msg, loading: false }
  //             : msg
  //         )
  //       );
  //     }
  //   };
  
    // Keep the rest of your existing JSX here.
  
    //   };
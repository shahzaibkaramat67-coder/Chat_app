"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


function UserInputSection({ messages = [], setmessages, loading, setloading }) {
  const [input, setInput] = useState("");
  const route = useRouter()

  console.log("input", input);


  const sendHendeler = async () => {
    if (!input.trim()) return null



    const userInput = input.trim()

    console.log("userInput", userInput);
  const userID = crypto.randomUUID()

    setmessages((prev) => [
      ...prev,    
      {id : userID, role: "user", content: userInput }
    ])

    setInput("");

    setloading(true)

    const aiID = crypto.randomUUID()


    setmessages((prev) => [
      ...prev,
      { id: aiID, role: "assistant", content: "", loading: true }
      // { role: "assistant", message: data.ApiReply, loading : true }
    ])



    const res = await fetch("/Api/Chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userInput, userId : userID}),
    });

    if(res.status === 401){
       
    const refreshToken = await fetch("/Api/refresh-token", {
      method : "POST",
      credentials: "include"
    })
   
    if (refreshToken.ok) {
      return route.push("/")
      
    }else{
      
      return route.push("/login")
    }


    }

    const reader = res.body.getReader()
    console.log("reader", reader);
    const decoder = new TextDecoder();


    let fullText = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break;

      const chunk = decoder.decode(value)
      console.log("chunk", chunk);


      const lines = chunk.split("\n").filter(Boolean)
      for (let line of lines) {
        try {
          const json = JSON.parse(line)
          console.log("json", json);


          if (json.response) {
            fullText += json.response

            setmessages(prev =>
              prev.map(msg =>
                msg.id === aiID
                  ? { ...msg, content: fullText, loading: false }
                  : msg
              )
            );

            // setmessages(prev => {
            //   prev.map(msg => {
            //     msg.id === aiText ? { ...msg, message: fullText, loading: false } : msg
            //   })
            // })

          }

        } catch (error) {
          console.error(error);

        }

      }


    }
setloading(false)

    const res2 = await fetch("/Api/saveAi", {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "assistant",
        message: fullText
      })
    })







  }

  return (
    // <div className="w-full px-6 py-4 border-t bg-white">
    <div className="flex flex-col items-center justify-center flex-1 px-6  relative group">

      {/* Heading */}

      {messages.length == 0 && (
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Hi, How Are You?
        </h1>
      )}



      {/* Input Box */}
      <div className={`${messages ? "disabled" : "b"} w-full max-w-3xl bg-white shadow-sm border rounded-xl p-3`}>

        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendHendeler()
          }}
          placeholder="Type your message..."
          className="w-full outline-none text-black text-sm"

        />

        {/* Bottom Icons */}
        <div className="flex items-center justify-between mt-4">

          <div className="flex gap-1 items-center">
            <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
            <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
            <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white">A</div>
          </div>

          {/* Send Button */}
          <div
            onClick={sendHendeler}

            className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            ➤
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
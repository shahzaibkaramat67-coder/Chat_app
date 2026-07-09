import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// const Client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
async function AiFunction(text) {

  try {

    console.log("here stating the AI work");


    const response = await fetch("http://localhost:11434/api/generate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "deepseek-coder:1.3b",
        prompt: `
                      You are a senior software engineer.

                      Rules:
You must follow this output format strictly:

1. If explanation is required:
   - Use bullet points first
   - Keep it short and structured

2. If code is required:
   - Output ONLY code block
   - No explanation inside code
   - No extra text before or after code

3. Code quality rules:
   - Must be valid and runnable
   - No broken tags or syntax
   - No duplicated or unnecessary code

4. General rules:
   - No emojis
   - No random characters
   - No hallucinated 
   - Be production-ready always

                      User: ${text}
                      Assistant:
                 `,
        stream: true

      })
    })


    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain",
      },
    })


    //    const data =await response.json()
    // //    console.log("data", data);


    //    return data.response



  } catch (error) {
    console.error(error);

  }

}

export default AiFunction
import { GoogleGenerativeAI } from "@google/generative-ai";

// import { model } from "mongoose";

import { NextRequest, NextResponse } from "next/server";


// import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function AiFunction(text, choseModel) {
  try {
    console.log("Starting AI work");

    const model = client.getGenerativeModel({
      model: choseModel,
      systemInstruction: `
        You are a senior software engineer.

        Rules:
        1. For explanations, use bullet points first and keep them short.
        2. For code requests, output only a code block.
        3. Code must be valid and runnable.
        4. Avoid unnecessary or duplicated code.
        5. Do not use emojis or invent facts.
      `,
    });

    return await model.generateContentStream(text);
   
 
  } catch (error) {
    console.error("Gemini error:", error.message);
    throw error;
  }
}

export default AiFunction;










































// async function AiFunction(text, choseModel) {
//   const Client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

//   console.log("text", text);


//   try {

//     console.log("here stating the AI work");

//     const res = await Client.GoogleGenerativeAI(
//       {
//         model: choseModel,
//         prompt: """
//           You are a senior software engineer.

//           Rules:
//         You must follow this output format strictly:

//           1. If explanation is required:
//           - Use bullet points first
//    - Keep it short and structured

// 2. If code is required:
//       - Output ONLY code block
//     - No explanation inside code
//     - No extra text before or after code

// 3. Code quality rules:
//       - Must be valid and runnable
//     - No broken tags or syntax
//     - No duplicated or unnecessary code

// 4. General rules:
//       - No emojis
//     - No random characters
//     - No hallucinated
//     - Be production - ready always

//                       User: ${ text }
//                       Assistant:
//   ,
//       stream: true

//     """
//   }


    





// console.log("response", response)

// return new Response(response.body, {
//   headers: {
//     "Content-Type": "text/plain",
//   },
// })


//     //    const data =await response.json()
//     // //    console.log("data", data);


//     //    return data.response



//   } catch (error) {
//   console.error(error);

// }

// }}

// export default AiFunction
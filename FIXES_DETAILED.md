# CORRECTED CODE - HOW TO FIX EACH FILE

---

## FILE 1: Fix verify.js [app/lib/verify.js]

### CURRENT CODE (WRONG):
```javascript
import { decode } from "punycode";
import jwt from "jsonwebtoken";

const getToken = async (req)=>{
   const token = req.cookies.get("AccessToken").value;
   const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   const userId = decode._id
   return userId  // ❌ RETURNS ONLY userId
}

export default getToken
```

### CORRECTED CODE:
```javascript
import jwt from "jsonwebtoken";

const getToken = async (req) => {
  try {
    const cookieValue = req.cookies.get("AccessToken");
    
    if (!cookieValue) {
      throw new Error("AccessToken cookie not found");
    }
    
    const token = cookieValue.value;
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Return full decoded object with _id property
    return decoded;
    
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
};

export default getToken;
```

**Key Changes:**
- ✅ Return full `decoded` object (not just `userId`)
- ✅ Add error handling for missing cookies
- ✅ Add try-catch block
- ✅ Better error messages

---

## FILE 2: Fix Chat Route [app/Api/Chat/route.js]

### CURRENT CODE (WRONG):
```javascript
import React from 'react'
import { NextResponse } from 'next/server'
import { json } from 'stream/consumers';
import dbConnection from '../../lib/db';
import AiFunction from '../../lib/Ai';
import Message from '../../../model/massage';
import jwt from "jsonwebtoken"
import { TokenClass } from 'typescript';
import Chat from '../../../model/Chat';
import { title } from 'process';
import { NEXT_CACHE_ROOT_PARAM_TAG_ID } from 'next/dist/lib/constants';
import getToken from '../../lib/verify';

export async function POST(req) {
  console.log("here CHat route is starting");

  try {
    await dbConnection()

    const body = await req.json();
    console.log("here CHat route body", body);
    const user = await getToken(req)  // ❌ Returns only userId
    console.log("this is from CHat route body", user);

    const { text, userId } = body;
    console.log("this is also from chat route", text);

    const chatId = await Chat.findOne({ userId })  // ❌ Gets object, not ID
    console.log("chatId", chatId);

    if (!chatId) {  // ❌ Wrong logic
      const saveUserData = await Chat.create({
        userId: user._id,  // ❌ user is string, not object
        chatId,  // ❌ undefined
        title: title.slice(0, 30)  // ❌ title not defined
      })
    } else {
      const saveUserData = await Message.create({
        chatId: chat_id,  // ❌ Wrong variable name
        role: "user",
        content: text
      })
    }

    const ApiReply = await AiFunction(text)
    console.log("this is from chat route cmdApiReply", ApiReply);

    if (!ApiReply) {
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }

    const saveAIData = await Message.create({
      role: "assistant",
      message: ApiReply  // ❌ Should be 'content'
    })

    return new NextResponse(ApiReply.body, {
      headers: { "Content-Type": "text/plain" }
    })

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
```

### CORRECTED CODE:
```javascript
import { NextResponse } from 'next/server';
import dbConnection from '../../lib/db';
import AiFunction from '../../lib/Ai';
import Message from '../../../model/massage';
import Chat from '../../../model/Chat';
import getToken from '../../lib/verify';

export async function POST(req) {
  console.log("🚀 Chat route starting");

  try {
    // Connect to database
    await dbConnection();

    // Get request body
    const body = await req.json();
    console.log("📦 Request body:", body);

    // Get user from token - now returns full decoded object
    const user = await getToken(req);
    console.log("👤 User from token:", user);

    // Extract text from body
    const { text } = body;
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: "Text cannot be empty" }, { status: 400 });
    }
    console.log("💬 User message:", text);

    // Find existing chat for this user
    let existingChat = await Chat.findOne({ userId: user._id });
    console.log("🔍 Existing chat:", existingChat);

    let chatId;

    // Create new chat if doesn't exist
    if (!existingChat) {
      console.log("📝 Creating new chat...");
      const newChat = await Chat.create({
        userId: user._id,
        title: text.slice(0, 30)  // ✅ Use 'text' not 'title'
      });
      chatId = newChat._id;
      console.log("✅ New chat created:", newChat._id);
    } else {
      chatId = existingChat._id;
      console.log("♻️ Using existing chat:", chatId);
    }

    // Save user message to database
    const userMessage = await Message.create({
      chatId: chatId,  // ✅ Correct variable name
      role: "user",
      content: text    // ✅ Correct field name
    });
    console.log("✅ User message saved:", userMessage._id);

    // Get AI response
    const ApiReply = await AiFunction(text);
    console.log("🤖 AI response received");

    if (!ApiReply) {
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }

    // Save AI message to database
    const aiMessage = await Message.create({
      chatId: chatId,  // ✅ Add missing chatId
      role: "assistant",
      content: ApiReply  // ✅ Use 'content' not 'message'
    });
    console.log("✅ AI message saved:", aiMessage._id);

    // Return AI response as stream
    return new NextResponse(ApiReply.body, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    console.error("❌ Error in chat route:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// ✅ ADD GET METHOD - MISSING IN ORIGINAL!
export async function GET(req) {
  console.log("🚀 Fetching chat history");

  try {
    await dbConnection();

    // Get user from token
    const user = await getToken(req);
    console.log("👤 Fetching chats for user:", user._id);

    // Find all chats for this user
    const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });
    console.log("📚 Found chats:", chats.length);

    // Find all messages for these chats
    const chatIds = chats.map(c => c._id);
    const messages = await Message.find({ chatId: { $in: chatIds } }).sort({ createdAt: 1 });
    console.log("📨 Found messages:", messages.length);

    return NextResponse.json({ 
      messages, 
      chats,
      success: true 
    });

  } catch (error) {
    console.error("❌ Error fetching chat:", error);
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}
```

**Key Fixes:**
- ✅ Fix `title` → `text`
- ✅ Fix `chat_id` → `chatId`
- ✅ Fix `message` → `content`
- ✅ Add missing `chatId` in AI message save
- ✅ Proper variable assignment after Chat creation
- ✅ Add GET method endpoint
- ✅ Better error handling and logging

---

## FILE 3: Fix UserInput Component [app/chat/UserInput/page.jsx]

### KEY PROBLEM CODE:
```javascript
const userID = crypto.randomUUID()  // ❌ WRONG! Random UUID

body: JSON.stringify({ text: userInput, userId : userID}),
```

### CORRECTION:
Replace the `sendHendeler` function with:

```javascript
const sendHendeler = async () => {
  if (!input.trim()) return null

  const userInput = input.trim();
  console.log("📝 User input:", userInput);

  // ✅ Get actual userId from the API/database, not random UUID
  // You can store it from login or fetch it
  let userId;
  
  try {
    // Option 1: Get from cookie/localStorage if stored during login
    // This assumes you stored user data during authentication
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      userId = userData._id;
    } else {
      // Option 2: Fetch current user info
      const userRes = await fetch('/Api/me'); // You'll need to create this endpoint
      const userData = await userRes.json();
      userId = userData._id;
    }
  } catch (err) {
    console.error("❌ Failed to get user ID:", err);
    return route.push("/login");
  }

  // Add user message to UI immediately
  const userID = crypto.randomUUID();
  setmessages((prev) => [
    ...prev,    
    { id: userID, role: "user", content: userInput }
  ]);

  setInput("");
  setloading(true);

  // Add AI loading placeholder
  const aiID = crypto.randomUUID();
  setmessages((prev) => [
    ...prev,
    { id: aiID, role: "assistant", content: "", loading: true }
  ]);

  // ✅ Send actual userId to backend
  const res = await fetch("/Api/Chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      text: userInput, 
      userId: userId  // ✅ Use actual userId, not random UUID
    }),
  });

  if (res.status === 401) {
    const refreshToken = await fetch("/Api/refresh-token", {
      method: "POST",
      credentials: "include"
    });
   
    if (refreshToken.ok) {
      return route.push("/");
    } else {
      return route.push("/login");
    }
  }

  try {
    const reader = res.body.getReader();
    console.log("📖 Reader initialized");
    const decoder = new TextDecoder();

    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      console.log("📦 Chunk received:", chunk.length, "bytes");

      // ✅ Parse streaming response correctly
      const lines = chunk.split("\n").filter(Boolean);
      for (let line of lines) {
        try {
          const json = JSON.parse(line);
          console.log("✅ Parsed JSON:", json);

          if (json.response) {
            fullText += json.response;

            // Update UI with accumulated text
            setmessages(prev =>
              prev.map(msg =>
                msg.id === aiID
                  ? { ...msg, content: fullText, loading: false }
                  : msg
              )
            );
          }

        } catch (error) {
          // Skip lines that aren't valid JSON
          console.log("⚠️ Non-JSON line skipped");
        }
      }
    }

    setloading(false);

    // Save AI response (optional - already saved in backend)
    const res2 = await fetch("/Api/saveAi", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: userId,  // ✅ Use actual chatId
        role: "assistant",
        content: fullText  // ✅ Use 'content' not 'message'
      })
    });

    if (!res2.ok) {
      console.error("⚠️ Failed to save AI response");
    }

  } catch (error) {
    console.error("❌ Error during message processing:", error);
    setloading(false);
    setmessages(prev =>
      prev.map(msg =>
        msg.id === aiID
          ? { ...msg, content: "Error processing response", loading: false }
          : msg
      )
    );
  }
};
```

**Key Fixes:**
- ✅ Get actual userId from auth/database
- ✅ Proper error handling
- ✅ Better logging for debugging
- ✅ Correct field names

---

## FILE 4: Create .env.local

### Create file: `d:\app\tool_app\.env.local`

```env
# ======================
# DATABASE CONFIGURATION
# ======================
MONGODB_URL=mongodb://localhost:27017/

# ======================
# JWT/AUTHENTICATION
# ======================
# Generate secure secrets: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ACCESS_TOKEN_SECRET=your_super_secret_access_token_min_32_characters_long_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_min_32_characters_long_here
JWT_EXPIRE=1h

# ======================
# EMAIL CONFIGURATION (if using)
# ======================
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# ======================
# AI/API CONFIGURATION
# ======================
# Gemini API (if needed)
GEMINI_API_KEY=sk-xxxxx

# Ollama local (ensure running on localhost:11434)
OLLAMA_API_URL=http://localhost:11434/api/generate

# ======================
# APP CONFIGURATION
# ======================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**How to generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## CHECKLIST TO FIX YOUR PROJECT

- [ ] **Step 1:** Create `.env.local` file with all variables
- [ ] **Step 2:** Update `app/lib/verify.js` with error handling
- [ ] **Step 3:** Replace entire `app/Api/Chat/route.js` with corrected version
- [ ] **Step 4:** Update `sendHendeler` function in `app/chat/UserInput/page.jsx`
- [ ] **Step 5:** Ensure MongoDB is running
- [ ] **Step 6:** Ensure Ollama is running on `localhost:11434`
- [ ] **Step 7:** Run `npm run dev` and test


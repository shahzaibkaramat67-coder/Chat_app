# 🚀 QUICK FIX - LINE BY LINE

## FILE 1: Create .env.local

**Location:** `d:\app\tool_app\.env.local` (NEW FILE)

**CRITICAL - Without this, nothing works!**

```env
# Database
MONGODB_URL=mongodb://localhost:27017/

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=use_output_from_node_command_above_min_32_chars
REFRESH_TOKEN_SECRET=use_output_from_node_command_above_min_32_chars

# Ollama (local AI)
OLLAMA_API_URL=http://localhost:11434/api/generate

# Optional
GEMINI_API_KEY=sk-xxxxx
NODE_ENV=development
```

---

## FILE 2: app/lib/verify.js

**Location:** `app/lib/verify.js` (REPLACE ENTIRE FILE)

### Current (WRONG):
```javascript
import { decode } from "punycode";
import  jwt  from "jsonwebtoken";

const getToken = async (req)=>{
   
    const token = req.cookies.get("AccessToken").value;

        const decode =await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const userId = decode._id

        return userId  // ❌ WRONG - returns only userId string


}

export default getToken
```

### Fixed:
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
    
    return decoded;  // ✅ CORRECT - returns full object with _id
    
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
};

export default getToken;
```

---

## FILE 3: app/Api/Chat/route.js

**Location:** `app/Api/Chat/route.js` (REPLACE ENTIRE FILE)

### Key Changes:
- Line 18: Add console log
- Line 22: Add dbConnection
- Line 26: Get user properly
- Line 30: Extract text correctly
- Line 34: Find existing chat (returns object or null)
- Line 40: Check if chat exists correctly
- Line 41: Create new chat (ADD THIS FIX)
- Line 48: Use `text` not `title`
- Line 55: Fix variable name
- Line 68: Fix field name
- Line 72: Add missing chatId
- Line 76: Add missing chatId in AI message
- Line 82: Add GET method (MISSING)

### Fixed Code:
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

    // Get user from token
    const user = await getToken(req);
    console.log("👤 User from token:", user);

    // Extract text from body
    const { text } = body;
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: "Text cannot be empty" }, { status: 400 });
    }
    console.log("💬 User message:", text);

    // ✅ FIX 1: Find existing chat (returns Chat object or null)
    let existingChat = await Chat.findOne({ userId: user._id });
    console.log("🔍 Existing chat:", existingChat);

    let chatId;

    // ✅ FIX 2: Check if chat exists
    if (!existingChat) {
      console.log("📝 Creating new chat...");
      // ✅ FIX 3: Create new chat WITHOUT chatId field
      const newChat = await Chat.create({
        userId: user._id,
        title: text.slice(0, 30)  // ✅ FIX 4: Use 'text' not 'title'
      });
      chatId = newChat._id;  // ✅ FIX 5: Assign the ID
      console.log("✅ New chat created:", newChat._id);
    } else {
      chatId = existingChat._id;
      console.log("♻️ Using existing chat:", chatId);
    }

    // ✅ FIX 6: Save user message with correct chatId
    const userMessage = await Message.create({
      chatId: chatId,      // ✅ FIX 7: Use correct variable (not chat_id)
      role: "user",
      content: text        // ✅ Field name is correct
    });
    console.log("✅ User message saved:", userMessage._id);

    // Get AI response
    const ApiReply = await AiFunction(text);
    console.log("🤖 AI response received");

    if (!ApiReply) {
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }

    // ✅ FIX 8: Save AI message with chatId and correct field name
    const aiMessage = await Message.create({
      chatId: chatId,      // ✅ FIX 9: Add missing chatId
      role: "assistant",
      content: ApiReply    // ✅ FIX 10: Use 'content' not 'message'
    });
    console.log("✅ AI message saved:", aiMessage._id);

    return new NextResponse(ApiReply.body, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    console.error("❌ Error in chat route:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// ✅ FIX 11: ADD MISSING GET METHOD
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

---

## FILE 4: app/chat/UserInput/page.jsx

**Location:** `app/chat/UserInput/page.jsx`

### Key Change: Replace `sendHendeler` function (around line ~19)

### Current (WRONG):
```javascript
const sendHendeler = async () => {
  if (!input.trim()) return null

  const userInput = input.trim()
  console.log("userInput", userInput);
  
  const userID = crypto.randomUUID()  // ❌ WRONG - Random UUID!

  setmessages((prev) => [
    ...prev,    
    {id : userID, role: "user", content: userInput }
  ])

  // ... rest of function ...
  
  const res = await fetch("/Api/Chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: userInput, userId : userID}),  // ❌ Wrong userId
  });
```

### Fixed:
```javascript
const sendHendeler = async () => {
  if (!input.trim()) return null

  const userInput = input.trim();
  console.log("📝 User input:", userInput);

  // ✅ FIX 1: Get actual userId (not random UUID)
  let userId;
  try {
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      userId = userData._id;
    } else {
      // If no user in localStorage, fetch it
      const userRes = await fetch('/Api/me');
      const userData = await userRes.json();
      userId = userData._id;
    }
  } catch (err) {
    console.error("❌ Failed to get user ID:", err);
    return route.push("/login");
  }

  const userID = crypto.randomUUID();  // For UI only (local state)
  setmessages((prev) => [
    ...prev,    
    { id: userID, role: "user", content: userInput }
  ]);

  setInput("");
  setloading(true);

  const aiID = crypto.randomUUID();
  setmessages((prev) => [
    ...prev,
    { id: aiID, role: "assistant", content: "", loading: true }
  ]);

  // ✅ FIX 2: Use actual userId from database
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

      const lines = chunk.split("\n").filter(Boolean);
      for (let line of lines) {
        try {
          const json = JSON.parse(line);
          console.log("✅ Parsed JSON:", json);

          if (json.response) {
            fullText += json.response;

            setmessages(prev =>
              prev.map(msg =>
                msg.id === aiID
                  ? { ...msg, content: fullText, loading: false }
                  : msg
              )
            );
          }

        } catch (error) {
          console.log("⚠️ Non-JSON line skipped");
        }
      }
    }

    setloading(false);

    const res2 = await fetch("/Api/saveAi", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: userId,
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

---

## QUICK COPY-PASTE SUMMARY

### 1. Create file: `.env.local`
```
MONGODB_URL=mongodb://localhost:27017/
ACCESS_TOKEN_SECRET=<generate_with_node_command>
REFRESH_TOKEN_SECRET=<generate_with_node_command>
OLLAMA_API_URL=http://localhost:11434/api/generate
NODE_ENV=development
```

### 2. Replace entire: `app/lib/verify.js`
✅ See FILE 2 above

### 3. Replace entire: `app/Api/Chat/route.js`
✅ See FILE 3 above (includes GET method)

### 4. Replace `sendHendeler` function in: `app/chat/UserInput/page.jsx`
✅ See FILE 4 above

---

## VALIDATION CHECKLIST

After making changes:

- [ ] `.env.local` created with all variables
- [ ] `verify.js` returns full decoded object
- [ ] `Chat/route.js` uses `text` instead of `title`
- [ ] `Chat/route.js` uses `chatId` instead of `chat_id`
- [ ] `Chat/route.js` uses `content` instead of `message`
- [ ] `Chat/route.js` has GET method added
- [ ] `UserInput/page.jsx` uses actual userId
- [ ] All files saved ✅

Then:
```bash
npm run dev
```


# 🔧 TROUBLESHOOTING & TESTING GUIDE

---

## ✅ VERIFICATION CHECKLIST

### Before Running the App

#### 1. Environment Setup
```bash
# Check if .env.local exists
dir | findstr .env

# Check Node version
node --version  # Should be v18+

# Check npm version
npm --version  # Should be v9+
```

#### 2. Dependencies Installed
```bash
# Check if node_modules exists
dir node_modules

# If not, install:
npm install

# Verify key packages
npm list mongoose
npm list next
npm list @google/generative-ai
```

#### 3. MongoDB Connection
```bash
# Check if MongoDB is running
# If using local MongoDB:
# mongod --version

# If using MongoDB Atlas, ensure connection string is in .env.local
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

#### 4. Ollama Setup
```bash
# Ollama must be running locally
# Download from: https://ollama.ai

# In a separate terminal, start Ollama:
ollama serve

# In another terminal, verify it's running:
curl http://localhost:11434/api/tags

# Pull the required model:
ollama pull deepseek-coder:1.3b

# Verify the model is available:
curl http://localhost:11434/api/tags
# Should see deepseek-coder:1.3b in the list
```

---

## 🚀 HOW TO START THE APP

### Step 1: Terminal Setup (3 separate terminals needed)

**Terminal 1 - MongoDB:**
```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas
# Just ensure .env.local has correct MONGODB_URL
```

**Terminal 2 - Ollama:**
```bash
ollama serve
```

**Terminal 3 - Next.js App:**
```bash
cd d:\app\tool_app
npm run dev

# App should be available at http://localhost:3000
```

### Step 2: Test the Flow

1. Go to http://localhost:3000
2. Login/Signup
3. Go to chat page
4. Type a message
5. Check console for logs

---

## 🐛 DEBUGGING - WHERE TO LOOK FOR ERRORS

### Browser Console (F12 → Console tab)
These show frontend errors:
- Network request failures
- JavaScript parsing errors
- Component rendering errors

**Common Errors:**
```
❌ "Cannot read property '_id' of undefined"
→ Fix: User token not being retrieved properly

❌ "chatId is not defined"  
→ Fix: Variable scope issue, check Chat/route.js

❌ "Failed to fetch"
→ Fix: API endpoint not working or CORS issue

❌ "Token not found"
→ Fix: Cookie not being set, auth issue
```

### Server Console (Terminal with npm run dev)
These show backend errors:
- Database connection issues
- API route errors
- Environment variable issues

**Common Errors:**
```
❌ "MONGODB_URL is undefined"
→ Fix: .env.local not loaded, restart with npm run dev

❌ "Cannot find module 'mongoose'"
→ Fix: npm install not run

❌ "AccessToken cookie not found"
→ Fix: User not logged in or cookie misconfigured

❌ "connect ECONNREFUSED 127.0.0.1:27017"
→ Fix: MongoDB not running

❌ "ConnectionError: Cannot read property 'chat_id' of undefined"
→ Fix: Chat/route.js line 55 error
```

### MongoDB Compass (Database GUI)
Check if data is being saved:

1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017` (or your Atlas connection)
3. Check database: `AI_Project`
4. Collections should have:
   - `chats` (Chat documents)
   - `messages` (Message documents)
   - `users` (User documents)

**Expected data structure:**
```
chats collection:
{
  _id: ObjectId,
  userId: ObjectId,
  title: "First 30 chars of message",
  createdAt: ISODate,
  updatedAt: ISODate
}

messages collection:
{
  _id: ObjectId,
  chatId: ObjectId,
  role: "user" or "assistant",
  content: "The message text",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## 📋 TEST SCENARIOS

### Test 1: User Signup
**Expected Result:** User created in database
```bash
# Check in Terminal 3 (npm run dev) for:
✅ "db ic connected"
✅ "User created successfully" (or similar)

# Check in MongoDB Compass:
✅ New document in 'users' collection
```

### Test 2: User Login
**Expected Result:** AccessToken cookie set
```bash
# In browser, press F12 → Application → Cookies
✅ Should see 'AccessToken' cookie
✅ Token should be long JWT string
```

### Test 3: Send First Chat Message
**Expected Result:** Chat created + Message saved
```bash
# Console logs should show:
✅ "🚀 Chat route starting"
✅ "👤 User from token: {...}"
✅ "📝 Creating new chat..."
✅ "✅ New chat created: 65a1b2c3d4e5f6g7h8i9j0k1l"
✅ "✅ User message saved: 65a1b2c3d4e5f6g7h8i9j0k1m"
✅ "🤖 AI response received"
✅ "✅ AI message saved: 65a1b2c3d4e5f6g7h8i9j0k1n"

# In MongoDB Compass:
✅ New document in 'chats' collection
✅ 2 documents in 'messages' collection (user + ai)
```

### Test 4: Send Second Chat Message
**Expected Result:** Message added to existing chat
```bash
# Console should show:
✅ "♻️ Using existing chat: 65a1b2c3d4e5f6g7h8i9j0k1l"
✅ NOT "📝 Creating new chat"

# In MongoDB Compass:
✅ Same chat document (no new one created)
✅ 4 documents in messages now (2 more added)
```

### Test 5: Load Chat History
**Expected Result:** Previous messages display
```bash
# Browser console should show messages from DB
✅ "Fetch messages from DB" working
✅ Messages display in chat UI
```

---

## 🆘 QUICK FIX REFERENCE

| Problem | Cause | Solution |
|---------|-------|----------|
| **App won't start** | Port 3000 in use | `npx kill-port 3000` then `npm run dev` |
| **"Cannot connect to database"** | MongoDB not running | Start MongoDB: `mongod` |
| **"Undefined token"** | .env.local not loaded | Restart: `npm run dev` |
| **"Chat not saved"** | Wrong field names | Update Chat/route.js |
| **"No chat created"** | `title` variable error | Fix `text.slice(0, 30)` |
| **"500 error on chat POST"** | User ID issue | Check verify.js returns full object |
| **"Ollama not responding"** | Ollama not running | Start: `ollama serve` |
| **"Random UUIDs in DB"** | Using wrong userID | Use actual userId from auth |

---

## 📝 LOGGING CHECKLIST

Add these logs to track what's happening (already in fixed code):

```javascript
// Frontend - In UserInput component
console.log("📝 User input:", userInput);
console.log("📖 Reader initialized");
console.log("📦 Chunk received:", chunk.length, "bytes");

// Backend - In Chat/route.js
console.log("🚀 Chat route starting");
console.log("👤 User from token:", user);
console.log("💬 User message:", text);
console.log("🔍 Existing chat:", existingChat);
console.log("✅ New chat created:", newChat._id);
console.log("✅ User message saved:", userMessage._id);
console.log("✅ AI message saved:", aiMessage._id);
```

**What to look for:**
- ✅ All logs should appear in order
- ✅ No "undefined" values
- ✅ No "Cannot read property" errors
- ✅ MongoDB ObjectIds (24-char hex strings like: `65a1b2c3d4e5f6g7h8i9j0k1`)

---

## 🔍 NETWORK INSPECTION (Browser DevTools)

Press F12 → Network tab → Send a message

**Check the POST request to /Api/Chat:**
```
✅ Status: 200 (not 500, 401, 404)
✅ Request payload: { text: "...", userId: "..." }
✅ Response: stream data (begins with response JSON)
✅ Headers: Content-Type: application/json
```

**If Status 500:**
- Check server console for the actual error
- Most likely causes:
  - Missing .env variables
  - Database connection failed
  - Ollama not responding
  - Wrong model name

---

## 🎯 FINAL VERIFICATION

Before considering fixed, verify ALL of these:

- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:3000
- [ ] Login/Signup works
- [ ] First chat message creates chat + saves to DB
- [ ] Second message uses existing chat
- [ ] Chat history loads correctly
- [ ] No console errors (red X's)
- [ ] MongoDB Compass shows chats & messages
- [ ] AI responses stream and display correctly
- [ ] Each message has correct field names in DB

---

## 🆘 WHEN ALL ELSE FAILS

1. **Delete and reinstall everything:**
   ```bash
   rm -r node_modules
   rm package-lock.json
   npm install
   npm run dev
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -r .next
   npm run dev
   ```

3. **Check all file changes are saved:**
   - Verify .env.local is created ✅
   - Verify Chat/route.js is updated ✅
   - Verify verify.js is updated ✅

4. **Restart all services:**
   - Kill Terminal 1 (MongoDB) - Restart
   - Kill Terminal 2 (Ollama) - Restart
   - Kill Terminal 3 (npm run dev) - Restart

5. **Check logs line by line:**
   - If error on line X, search code for that exact issue
   - Compare with FIXES_DETAILED.md
   - Ensure ALL changes are applied


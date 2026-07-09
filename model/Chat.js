import mongoose, { Schema } from "mongoose";
import { type } from "os";

const ChatModel = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fullChatId: {
            type: String,
            require: true
        },

        title: {
            type: String,
            default: "New Chat"
            // required : true
        },



    }, { timestamps: true }
)
const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatModel)

export default Chat
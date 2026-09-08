import mongoose, { Schema } from "mongoose";
import { type } from "os";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null, // IMPORTANT
      select: false
    },

    image: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["credentials", "google", "microsoft", "apple"],
      default: "credentials",
    },

    providerId: {
      type: String,
      default: null,
    },

    isverified: {
      type: boolean,
      default: false,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "user"
    },



    refreshToken: String,
    refreshTokenExpiry: Date,

    accessToken: String,
    accessTokenExpiry: Date,

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
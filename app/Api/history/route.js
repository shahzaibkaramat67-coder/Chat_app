
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Chat from "../../../model/Chat";
import dbConnection from "../../lib/db";

export async function GET() {
    try {
        // 1. Get the access token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("AccessToken")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Authentication required",
                    redirect: "/login",
                },
                { status: 401 }
            );
        }

        // 2. Check the JWT secret
        const secretValue = process.env.ACCESS_TOKEN_SECRET;

        if (!secretValue) {
            console.error("ACCESS_TOKEN_SECRET is missing");

            return NextResponse.json(
                {
                    ok: false,
                    message: "Server configuration error",
                },
                { status: 500 }
            );
        }

        // 3. Verify the access token
        const secret = new TextEncoder().encode(secretValue);
        const { payload } = await jwtVerify(token, secret);

        // 4. Get the logged-in user's ID
        const userId = payload.userId;

        if (typeof userId !== "string" || !userId) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Invalid authentication token",
                },
                { status: 401 }
            );
        }

        // 5. Connect to MongoDB
        await dbConnection();

        // 6. Fetch only this user's chats
        const allChats = await Chat.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        // 7. Return the chat history
        const data = allChats.map((chat) => ({
            _id: chat._id.toString(),
            fullChatId: chat.fullChatId,
            title: chat.title,
        }));

        return NextResponse.json(
            {
                ok: true,
                History: data,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("History API error:", error);

        return NextResponse.json(
            {
                ok: false,
                message: "Failed to fetch chat history",
            },
            { status: 500 }
        );
    }
}














// import { env } from "node:process";
// import { NextResponse } from "next/server";
// import Chat from "../../../model/Chat";
// import dbConnection from "../../lib/db";
// import { cookies } from "next/headers";
// import { redirect } from "next/dist/server/api-utils";
// import { process } from "zod/v4/core";
// import { jwtVerify } from "jose";

// export async function GET() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("AccessToken")?.value
//     if (!token) {
//         return NextResponse.json(
//             { redirect: "/login" },
//             { status: 401 }
//         )
//     }



//     // console.log("Process exists:", typeof process);
//     // console.log("Env exists:", typeof env);
//     // console.log("Secret configured:", Boolean(env.ACCESS_TOKEN_SECRET));

//     // const secretValue = env.ACCESS_TOKEN_SECRET;
//     // console.log("secretValue :", secretValue)

//     // if (!secretValue) {
//     //     throw new Error("ACCESS_TOKEN_SECRET is missing");
//     // }

//     // const secret1 = new TextEncoder().encode(secretValue);
//     // const { payload } = await jwtVerify(token, secret1);
//     const secret = new TextEncoder().encode(
//         env.ACCESS_TOKEN_SECRET
//     );

//     const user = await jwtVerify(token, secret);

//     console.log("user :", user);
//     await dbConnection()

//     const allChats = await Chat.find({ userId: user.payload.userId }).sort({ createdAt: -1 })




//     console.log("allChats :", allChats);



//     if (allChats) {

//         const data = allChats.map(element => ({
//             fullChatId: element.fullChatId,
//             title: element.title
//         }));

//         console.log("data :", data);


//         return NextResponse.json(
//             {
//                 ok: true,
//                 History: data
//             }
//         )
//     }

// }
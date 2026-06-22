import { url } from "inspector";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import generateAccesstokenAndRefreshToken from "../../lib/auth";
import User from "../../../model/User";



export async function POST(req) {
    try {
        const resfreshToken = req.cookies.get("RefreshToken").value
        if (!resfreshToken) {

            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )

        }

        const decoded = await jwt.verify(resfreshToken, process.env.REFRESH_TOKEN_SECRECT)
        if (!decoded) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const user = await User.findById(decoded._id)
        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        if (user.resfreshToken != resfreshToken) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const { accessToken } = await generateAccesstokenAndRefreshToken(user_id)


        const response = NextResponse.json(
            {
                ok: true
            },
            {
                message: "Creating AccessToken"
            }
        )

        response.cookies.set("AccessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60,
            path: "/",
            secure: process.env.NODE_ENV === "production",
        })

        return response



    } catch (error) {
        const response = NextResponse.json(
            {
                error: error
            },
            {
                message: "something went wrong"
            }
        )

    }
}


// export async function POST(req) {

//     try {
//         const refreshToken = req.cookies.get("RefreshToken")?.value;

//         if (!refreshToken) {

//             return NextResponse.json(
//                 {
//                     message: "User not found"
//                 },
//                 {
//                     status: 404
//                 }
//             )


//             //    return NextResponse.redirect(
//             //        new URL("/login", req.url)
//             //    )

//         }

//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRECT)

//         if (!decoded) {

//             return NextResponse.json(
//                 {
//                     message: "User not found"
//                 },
//                 {
//                     status: 404
//                 }
//             )


//             const user = await User.findById(decoded._id)

//             if (!user) {
//                 return NextResponse.json(
//                     {
//                         message: "User not found"
//                     },
//                     {
//                         status: 404
//                     }
//                 )


//             }

//             if (user.refreshToken !== refreshToken) {
//                 return NextResponse.json(
//                     {
//                         message: "User not found"
//                     },
//                     {
//                         status: 404
//                     }
//                 )
//             }


//             const { accessToken } = await generateAccesstokenAndRefreshToken(user._id);





//             const response = NextResponse.json(
//                 {
//                     ok: true
//                 },
//                 {
//                     message: "Creating AccessToken"
//                 }
//             )
//             response.cookies.set("AccessToken", accessToken, {
//                 httpOnly: true,
//                 sameSite: "strict",
//                 maxAge: 10 * 60,
//                 path: "/",
//                 secure: process.env.NODE_ENV === "production",



//             })

//             return response
//         }
//     } catch (error) {
//         const response = NextResponse.json(
//             {
//                 ok: true
//             },
//             {
//                 message: "Creating AccessToken"
//             }
//         )
//     }
// }
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import dbConnection from "../../../lib/db"
import User from "../../../../model/User"
import { NextResponse } from "next/server"

const hendler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],

    //    console.log("providers", providers);


    callbacks: {
        async signIn({ user, account }) {

            try {
                await dbConnection()

                const existUser = await User.findOne({ email: user.email })

                if (!existUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider,
                        providerId: account.providerAccountId,
                        isverified: true,
                        role: "user",
                        lastLogin: new Date()

                    })
                    return NextResponse.json({
                        message: "User creating",
                        status: "200"
                    })
                } else {
                    user.lastLogin = new Date()
                    await user.save()

                    return NextResponse.json({
                        message: "Ready To Go",
                        status: "200"
                    })
                }

                // return true
            } catch (error) {
                console.error("Google sign-in error", error)
                return NextResponse.json({
                    message: "something went wrong",
                    status: "400"
                })
            }
        }
    }
})




export { hendler as GET, hendler as POST }
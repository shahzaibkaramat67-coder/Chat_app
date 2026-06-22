import { NextResponse } from "next/server"
import User from "../../../model/User"
import dbConnection from "../../lib/db"

// NextResponse

export async function POST(req){
      console.log("req.cookie.get", req.cookie.get("email").value);
    

    const email =  req.cookie.get("email").value
    console.log("email", email);
    console.log("body", body);
    


    const body = await req.json()
    const {newpassword, confirmPassword} = body

    if (!newpassword || !confirmPassword) {
         return NextResponse.json(
                    {
                        ok: false,
                        massage: "both fields are required"
                    },
                    {
                        status: 400
                    }
                )
    }


    if (newpassword === confirmPassword) {
         return NextResponse.json(
                    {
                        ok: false,
                        massage: "password does not match"
                    },
                    {
                        status: 400
                    }
                )
        
    }

     await dbConnection()
   const findUser = await User.aggregate([
    {
        $match :{email : "email"}
    },
     {
            $set :{"password" : newpassword}
    }
   ])

   console.log("findUser", findUser);

   return NextResponse.redirect(
    new URL("/login", req.URL)
   )
   

   
}
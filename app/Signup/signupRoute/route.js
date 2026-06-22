import { NextResponse } from "next/server";
// import { email, success } from "zod";
import bcrypt from "bcrypt";
// import { connect } from "http2";
import dbConnection from "../../lib/db";
import User from "../../../model/User";
import { mail } from "../../lib/mail";

export async function POST(req){
  // console.log("req.body", req.body);

  const body = await req.json()

  if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        {
        ok : false,
        masage : "All fields are required"
      },{status : 401})
  }
   

  const hashPassword = await bcrypt.hash(body.password, 12)
  console.log("hashPassword", hashPassword);

  if (!hashPassword) {

    return NextResponse.json(
      {
        ok : false,
        masage : "something went wrong"
      },
      {
        status : 500
      }
    ) 
  }

  await dbConnection()

  const email = body.email.trim().toLowerCase()

  const alreadyUserExist = await User.findOne({email})

  if (alreadyUserExist) {
    console.log("already emial exist ");
    
    return NextResponse.json(
      {
        ok : false,
        masage : "Already this email exist"
      },
      {
        status : 400
      }
    ) 
  }else{
     const user = await User.create({
    name : body.name,
    email,
    password : hashPassword 
  })
  }

  

  console.log('body', body);
  console.log('body', body.name);
  console.log('body', body.email);
  console.log('body', body.password);

  try {
     await mail(body.email, body.name, "signup")
      return NextResponse.json({
        ok: true,
        message: " email sent to Your Mail"
    })

  } catch (error) {
    console.error(error);
    
  }


  return NextResponse.json({
    ok : true,
    Message : "Signup Successfull"
  })
  
  
}
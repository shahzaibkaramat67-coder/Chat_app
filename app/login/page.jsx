"use client"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { email } from "zod";
export default function SigninPage() {

 const route = useRouter()

  const [loading, setloading] = useState(false)

const [sigin, setsigin]  = useState({
  email : "",
  password : ""
})

const handleChange = (e)=>{
  setsigin({...sigin, [e.target.name] : e.target.value})
}

const submitHendler =async (e)=>{
  e.preventDefault()

  if (!sigin.email || !sigin.password) {
    console.log("both fields are important");
  }

  try {

    setloading(true)

      const res = await fetch("/login/loginRoute", {
        method : "post",
         headers :{
          "Content-type" : "application/json"
         },
         body : JSON.stringify(sigin)
      })
      const data = await res.json()
      if (data.ok) {
        console.log("data fetch successfully");
        route.push("/")
        
      }


  } catch (error) {
    console.error(error);
    
  }





}







  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHendler} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={sigin.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full  text-black mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              value={sigin.password}
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full  text-black mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <span className="text-amber-500 cursor-pointer hover:underline">
              <Link href="ForgotPassword">Forgot password?</Link>
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-2 w-full py-2 rounded-lg text-white font-medium bg-amber-500 hover:bg-amber-600 transition"
          >
            Sign In
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Login */}
        <button className="w-full border py-2 rounded-lg flex text-black items-center justify-center gap-2 hover:bg-gray-100 transition">
          <span>🔵</span>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?
          <span className="text-amber-500 cursor-pointer hover:underline">
            <Link href="Signup">Sign Up</Link>
          </span>
        </p>

      </div>
    </div>
  );
}
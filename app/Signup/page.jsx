"use client"
import React, { useState } from 'react'
import Link from "next/link";
import z from 'zod';
import { get } from 'http';


const schema = z.object({
  name: z.string().min(3, "Name is Too short"),
  email: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(8, "Minimum character should be 8")
    .regex(/[A-Z]/, "Must contain Uppercase")
    .regex(/[a-z]/, "Must contain Lowercase")
    .regex(/[0-9]/, "Must contain numbers")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),

})

function SignupPage() {



  const [loading, setloading] = useState(false)
  const [Signup, setSignup] = useState({
    name: "",
    email: "",
    password: ""
  })

  //  const name = Signup.name
  //   const email =  Signup.email
  //   const password =  Signup.password

  const handleChange = (e) => {
    setSignup({ ...Signup, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
      e.preventDefault();



    const result = schema.safeParse(Signup)

    if (!result.success) {
      console.error(result.error.format());
      return
    }
    try {
      setloading(true)

      const res = await fetch("/Signup/signupRoute", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Signup)

      })

      // console.log("res", res);
    const data = await res.json()
    console.log("data", data);
    
    if (data.ok) {
      console.log("sucess full working backend");      
    }

    // console.log("data", data);

      
    } catch (error) {
      console.error(error);
    } finally {
          setloading(false)
    }




   

  }

 async function google_Auth() {
   
    location.assign("/Auth/google_Auth")

  }







  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Start your journey with us
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* <form onSubmit={handleSubmit} className="flex flex-col gap-4"> */}

          {/* Name */}
          <div>
            <label className="text-sm  text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
                value={Signup.name}
                onChange={handleChange}
              placeholder="John Doe"
              className="w-full  text-black mt-1 px-4 py-2  border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
                value={Signup.email}
                onChange={handleChange}
              placeholder="you@example.com"
              className="w-full  text-black mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
                value={Signup.password}
                onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-1  text-black px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-2 rounded-lg text-white font-medium transition ${loading
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
              }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <button onClick={google_Auth} className="w-full border py-2 rounded-lg text-black flex items-center justify-center gap-2 hover:bg-gray-100 transition">
          <span>🔵</span>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-amber-500 cursor-pointer hover:underline">
            <Link href="login">Sign In</Link>
          </span>
        </p>

      </div>
    </div>
  );
}


export default SignupPage
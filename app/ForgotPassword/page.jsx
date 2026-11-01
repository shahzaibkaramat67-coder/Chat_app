"use client"
import Link from "next/link";
// import { useState } from "react";
// import { useEffect } from "react";
import { useState, useEffect } from "react";



export default function ForgotPasswordPage() {
  const [loading, setloading] = useState(false)
  const [showMessage, setShowMessage] = useState("")
  const [email, setemail] = useState({
    email: ""
  })


  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [showMessage]);

  const changeHendler = (e) => {
    setemail({ ...email, email: e.target.value })
  }
  const submitHendler = async (e) => {
    e.preventDefault()


    try {
      setloading(true)

      const res = await fetch("/ForgotPassword/Route", {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(email)
      })

      const data = await res.json()
      console.log("data", data);

      if (data.ok) {
        setShowMessage(data.message)
        console.log("sucess full working backend");
      }

    } catch (error) {
      console.error(error);

    }

  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {showMessage && (
        <div className="fixed top-5 right-5 z-9999 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl">
          {showMessage}
        </div>
      )}


      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Forgot Password?
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHendler} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label htmlFor="forgot-email" className="text-sm text-gray-600">Email</label>
            <input
              id="forgot-email"
              name="email"
              value={email.email}
              onChange={changeHendler}
              type="email"
              placeholder="you@example.com"
              className="w-full  text-black mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 rounded-lg text-white font-medium bg-amber-500 hover:bg-amber-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Send Reset Link
          </button>

        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <span className="text-amber-500 cursor-pointer hover:underline">
            <Link href="login">Sign In</Link>
          </span>
        </p>

      </div>
    </div>
  );
}
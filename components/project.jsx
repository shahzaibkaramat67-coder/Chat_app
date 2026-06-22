"use client";

import React from "react";
import Image from "next/image";
import icons from "@/Assets/asset";

export default function Project({ setproject }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* MODAL */}
      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-lg font-semibold">Projects</h1>

          <button
            onClick={() => setproject(false)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Image
              src={icons.xSolidFull}
              alt="close"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* INPUT BAR (STATIC CHATGPT STYLE) */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 bg-[#222222] border border-gray-700 rounded-2xl px-3 py-2">

            <input
              type="text"
              placeholder="Create a new project..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />

            <button className="px-4 py-1.5 rounded-xl text-sm font-medium bg-amber-500 text-black hover:bg-amber-600 transition">
              Create
            </button>

          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="p-4 space-y-3 max-h-72 overflow-auto">

          {/* Card 1 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="font-semibold text-sm">AI Chat App</h2>
            <p className="text-xs text-gray-400 mt-1">
              Smart AI chat system with streaming responses
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="font-semibold text-sm">BlogHub Platform</h2>
            <p className="text-xs text-gray-400 mt-1">
              Full-stack blogging system with analytics dashboard
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="font-semibold text-sm">Omni AI Tools</h2>
            <p className="text-xs text-gray-400 mt-1">
              SaaS platform with 40+ AI productivity tools
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
import React from "react";
import Image from "next/image";
import icons from "@/Assets/asset";

function Search({ setSearch }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* MODAL */}
      <div className="w-full max-w-lg bg-[#171717] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">

          <h1 className="text-lg font-semibold text-white">
            Search Charts
          </h1>

          <button
            onClick={() => setSearch(false)}
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

        {/* SEARCH INPUT */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 bg-[#222222] border border-gray-700 rounded-2xl px-3 py-2 focus-within:border-amber-500 transition">

            <input
              type="text"
              placeholder="Search charts, analytics, reports..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />

            <span className="text-gray-400 text-xs">⌘K</span>

          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-3 max-h-72 overflow-auto">

          {/* Result 1 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="text-sm font-semibold">User Growth Chart</h2>
            <p className="text-xs text-gray-400 mt-1">
              Daily active users analytics
            </p>
          </div>

          {/* Result 2 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="text-sm font-semibold">Revenue Overview</h2>
            <p className="text-xs text-gray-400 mt-1">
              Monthly earnings and withdrawals
            </p>
          </div>

          {/* Result 3 */}
          <div className="bg-[#222222] hover:bg-[#2a2a2a] transition rounded-2xl p-3 cursor-pointer border border-transparent hover:border-gray-700">
            <h2 className="text-sm font-semibold">Engagement Stats</h2>
            <p className="text-xs text-gray-400 mt-1">
              Likes, shares, and comments trends
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-gray-800 text-xs text-gray-500 text-center">
          Press ESC to close
        </div>

      </div>
    </div>
  );
}

export default Search;
"use client";

import React from "react";
import Image from "next/image";
import icons from "@/Assets/asset";

function Profile({ setprofile }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* Profile Modal */}
      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Top Section */}
        <div className="relative h-28 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500">

          {/* Close Button */}
          <button
            onClick={() => setprofile(false)}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 transition p-2 rounded-full"
          >
            <Image
              src={icons.xSolidFull}
              alt="close"
              width={16}
              height={16}
            />
          </button>

          {/* Profile Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-[#171717] border-4 border-[#171717] flex items-center justify-center shadow-xl">

              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-black">
                  S
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-6 pb-6 text-white">

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-2xl font-bold">
                Shahzaib
              </h1>

              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                PRO
              </span>

            </div>

            <p className="text-gray-400 text-sm mt-1">
              @omni_ai_user
            </p>

            <p className="text-gray-300 text-sm leading-6 mt-4">
              AI developer building modern chat apps,
              AI tools, and smart SaaS platforms.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">

            <div className="bg-[#222222] rounded-2xl p-3 text-center">
              <h1 className="font-bold text-lg">
                124
              </h1>

              <p className="text-gray-400 text-xs">
                Chats
              </p>
            </div>

            <div className="bg-[#222222] rounded-2xl p-3 text-center">
              <h1 className="font-bold text-lg">
                48
              </h1>

              <p className="text-gray-400 text-xs">
                Projects
              </p>
            </div>

            <div className="bg-[#222222] rounded-2xl p-3 text-center">
              <h1 className="font-bold text-lg">
                2.4K
              </h1>

              <p className="text-gray-400 text-xs">
                Credits
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">

            <button className="flex-1 bg-amber-500 hover:bg-amber-600 transition py-3 rounded-2xl font-semibold text-black">
              Upgrade
            </button>

            <button className="flex-1 bg-[#222222] hover:bg-[#2a2a2a] transition py-3 rounded-2xl font-semibold">
              Edit
            </button>

          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-6 bg-[#222222] rounded-2xl p-4">

            {[
              icons.pencilSolidFull,
              icons.magnifyingGlassSolidFull,
              icons.bookSolidFull,
              icons.ellipsisSolidFull,
            ].map((icon, i) => (
              <button
                key={i}
                className="hover:scale-110 transition"
              >
                <Image
                  src={icon}
                  alt="icon"
                  width={22}
                  height={22}
                />
              </button>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
import React from "react";
import Image from "next/image";
import icons from "@/Assets/asset";

function Chat({ setChat }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* MODAL */}
      <div className="w-full max-w-lg bg-[#171717] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">

          <h1 className="text-lg font-semibold text-white">
            Chat Details
          </h1>

          <button
            onClick={() => setChat(false)}
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

        {/* CONTENT */}
        <div className="p-4 space-y-3 max-h-72 overflow-auto">

          <div className="bg-[#222222] rounded-2xl p-4 border border-gray-700">

            <p className="text-sm text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
              quibusdam aliquam harum at sunt ipsam consequuntur quam quisquam
              deleniti magni recusandae modi, blanditiis illo cumque impedit
              autem et veniam, sed quae. Porro consequatur laboriosam provident
              molestiae aliquam corrupti expedita eveniet cupiditate quis veniam.
            </p>

          </div>

        </div>

        {/* FOOTER (optional future input area) */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-[#222222] border border-gray-700 rounded-2xl px-3 py-2 text-sm text-gray-400">
            Chat info view (static)
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;
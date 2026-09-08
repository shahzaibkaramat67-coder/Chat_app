"use client";

import Image from "next/image";
import icons from "../Assets/asset.js";
import History from "@/components/history.jsx";

function Sidebar({ expand, setExpand, setprofile, setChat, setsearch, setproject }) {
  const menuItems = [
    { icon: icons.pencilSolidFull, label: "New Chat", action: () => setChat(true) },
    { icon: icons.magnifyingGlassSolidFull, label: "Search Chat", action: () => setsearch(true) },
    { icon: icons.bookSolidFull, label: "Projects", action: () => setproject(true) },
    { icon: icons.ellipsisSolidFull, label: "More" },
  ];

  return (
    <aside
      className={`fixed z-40 h-screen border-r border-white/10 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 md:relative ${
        expand ? "w-72" : "w-22"
      }`}
    >
      <div className="flex h-full flex-col justify-between p-3">
        <div>
          <div className="mb-5 flex items-center justify-between px-2 py-2">
            <div
              className={`flex h-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 ${
                expand ? "w-10" : "hidden"
              }`}
            >
              <Image src={icons.firstOrderAltBrandsSolidFull} alt="logo" width={18} height={18} />
            </div>

            <button
              onClick={() => setExpand(!expand)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
            >
              <Image src={icons.barsSolidFull} alt="toggle" width={14} height={14} />
            </button>
          </div>

          <div className="space-y-2 px-2">
            {expand && (
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Features
              </p>
            )}

            <div className="space-y-1.5">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`group relative flex w-full items-center rounded-xl border border-transparent px-3 py-2.5 text-left transition ${
                    expand ? "justify-start gap-3" : "justify-center"
                  } hover:border-white/10 hover:bg-white/5`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-200 ring-1 ring-white/5">
                    <Image src={item.icon} alt={item.label} width={16} height={16} />
                  </span>

                  {expand && <span className="text-sm font-medium text-slate-200">{item.label}</span>}

                  {!expand && (
                    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-slate-800 px-2 py-1 text-[11px] text-slate-200 opacity-0 shadow-lg transition group-hover:opacity-100">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <History expand={expand} />
        </div>

        <div className="mt-4 border-t border-white/10 p-3">
          <div className="flex items-center justify-between gap-3">
            {expand && <span className="text-sm font-medium text-slate-200">Profile</span>}
            <button
              onClick={() => setprofile(true)}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-105"
            >
              <Image src={icons.circleUserSolidFull} alt="user" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;










// import React from "react";
// import Image from "next/image";
// import icons from "../Assets/asset.js";

// function Sidebar({sidebarOpen, setSidebarOpen}) {



//   return (
//     <div className=" h-screen border-r border-gray-200 bg-white flex flex-col justify-between ${sidebarOpen ? 'w-20' : 'w-64'} ">

//       {/* Top Section */}
//       <div>

//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3">
//           <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition">
//             <Image
//               src={icons.firstOrderAltBrandsSolidFull}
//               alt="logo"
//               width={18}
//               height={18}
//             />
//           </div>

//           <div onClick={()=>setSidebarOpen(sidebarOpen)} className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
//             <Image
//               src={icons.barsSolidFull}
//               alt="close"
//               width={14}
//               height={14}
//             />
//           </div>
//         </div>


//         {/* Features Section */}
//         <div className="px-4 mt-6">
//           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//             Features
//           </h2>

//           <div className="mt-3 space-y-2">

//             <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <Image
//                 src={icons.pencilSolidFull}
//                 alt="new chat"
//                 width={16}
//                 height={16}
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 New Chat
//               </span>
//             </div>

//             <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <Image
//                 src={icons.magnifyingGlassSolidFull}
//                 alt="search"
//                 width={16}
//                 height={16}
//               />
//               <span className="text-sm text-gray-700">
//                 Search Chat
//               </span>
//             </div>

//             <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <Image
//                 src={icons.bookSolidFull}
//                 alt="projects"
//                 width={16}
//                 height={16}
//               />
//               <span className="text-sm text-gray-700">
//                 Projects
//               </span>
//             </div>

//             <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <Image
//                 src={icons.ellipsisSolidFull}
//                 alt="more"
//                 width={16}
//                 height={16}
//               />
//               <span className="text-sm text-gray-700">
//                 More
//               </span>
//             </div>

//           </div>
//         </div>


//         {/* History Section */}
//         <div className="px-4 mt-8">
//           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//             History
//           </h2>

//           <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">

//             <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
//               History 1
//             </div>

//             <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
//               History 2
//             </div>

//             <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
//               History 3
//             </div>

//             <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
//               History 4
//             </div>

//             <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
//               History 5
//             </div>

//           </div>
//         </div>

//       </div>


//       {/* Profile Section */}
//       <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">

//         <span className="text-sm font-medium text-gray-700 cursor-pointer">
//           Profile
//         </span>

//         <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold  transition cursor-pointer">
//             <Image
//                          src={icons.circleUserSolidFull}
//                          alt="logo"
//                          width={18}
//                          height={18}
//                        />
//         </div>

//       </div>

//     </div>
//   );
// }

// export default Sidebar;
"use client";
import { useState } from "react";
import Image from "next/image";
import icons from "../Assets/asset.js";
import History from "@/components/history.jsx"
// import Chat from "@/components/newChat.jsx"

function Sidebar({ expand, setExpand, setprofile, setChat, setsearch, setproject}) {

  // const [profile, setprofile] = useState(true)

    const manuItems =[
                { icon: icons.pencilSolidFull, label: "New Chat", action : () => setChat(true) },
                { icon: icons.magnifyingGlassSolidFull, label: "Search Chat", action : () => setsearch(true) },
                { icon: icons.bookSolidFull, label: "Projects", action : () => setproject(true) },
                { icon: icons.ellipsisSolidFull, label: "More" },
              ]

  return (
    <div
      className={`h-screen bg-white border-r flex flex-col justify-between transition-all duration-300
      ${expand ? "w-64" : "w-20"} 
      fixed md:relative z-50`}
    >

      {/* Top */}
      <div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className={` ${expand ? 'block' : 'hidden'} h-9 w-9 bg-amber-500 rounded-full flex items-center justify-center`}>
            <Image src={icons.firstOrderAltBrandsSolidFull} alt="logo" width={18} height={18} />
          </div>

          <button
            onClick={() => setExpand(!expand)}
            className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Image src={icons.barsSolidFull} alt="toggle" width={14} height={14} />
          </button>
        </div>

        {/* Menu */}
        <div className="px-4 mt-6 space-y-2">




          <div className="px-4 mt-6">
            {expand && (
              <h2 className={"text-xs font-semibold text-gray-500 uppercase tracking-wide"}>
                Features
              </h2>
            )}

            <div className="mt-3 space-y-2 :">

            



              {manuItems.map((item, i) => (
                <div key={i} onClick={item.action} className={`relative group flex items-center ${expand ? "gap-3 px-3 justify-start" : "justify-center"
                  } py-2 rounded-lg hover:bg-gray-100 cursor-pointer`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                  />

                  {expand && (
                    <span className="text-sm text-gray-700">{item.label}</span>
                  )}

                  {!expand && (
                      <span className="absolute left-full ml-3 
                           whitespace-nowrap
                           bg-indigo-300 text-black text-xs 
                           px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100
                           transition duration-200
                           pointer-events-none">
                      {item.label}
                      </span>
                  )}
                </div>
              ))
              }


            </div>
          </div>



         <History expand={expand}/>



        </div>

       

      </div>

      {/* Bottom */}
      <div className="p-4 border-t flex items-center justify-between">
        <span className={`text-black ${expand ? 'block' : 'hidden'}`}>Profile</span>
        <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center">
          <Image onClick={() => setprofile(true)}  className="cursor-pointer" src={icons.circleUserSolidFull} alt="user" width={18} height={18} />
        </div>
      </div>

    </div>
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
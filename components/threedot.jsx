import React from 'react'
import icons from '@/Assets/asset'
import Image from 'next/image'

function Threedot() {
  return (
    <div className="absolute top-14 right-4
      bg-white text-black text-sm p-2 rounded shadow-lg z-50">

      {[
        { icon: icons.thumbtacksolidfull, label: "Pin Chat" },
        { icon: icons.boxarchivesolidfull, label: "Archive" },
        { icon: icons.trashcansolidfull, label: "Delete" }
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-2 px-2 py-1 hover:bg-amber-700 rounded cursor-pointer">
          <Image src={item.icon} alt={item.label} width={18} height={18} />
          <span>{item.label}</span>
        </div>
      ))}

    </div>
  )
}
export default Threedot
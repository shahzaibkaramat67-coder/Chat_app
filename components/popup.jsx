import React from 'react'
import icons from '@/Assets/asset';
import Image from 'next/image';
function Popup({ popup, setpopup }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      
      {/* Overlay background (optional dark blur) */}
     <div
      className="absolute"
      onClick={() => setpopup(false)}
    />

      {/* Popup box */}
      <div className="relative w-175 bg-white rounded-xl shadow-xl p-4 z-50">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-black font-bold text-2xl ml-2">
            this is my first data
          </h1>

          <Image
            className="cursor-pointer"
            onClick={() => setpopup(false)}
            src={icons.xSolidFull}
            alt="close"
            height={30}
            width={30}
          />
        </div>

        <hr className="border-amber-300 border-2 my-3" />

        {/* Content */}
        <div className="bg-amber-300 mb-3 max-h-60 overflow-auto p-2">
          <p className="text-black text-sm">
           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore quibusdam aliquam harum at sunt ipsam consequuntur quam quisquam deleniti magni recusandae modi, blanditiis illo cumque impedit autem et veniam, sed quae. Porro consequatur laboriosam provident molestiae aliquam corrupti expedita eveniet cupiditate quis veniam. Nobis dolorum est asperiores, iste assumenda minus molestiae, officiis blanditiis minima ipsa commodi quibusdam. Fuga facere mollitia, dicta sed quam optio officia, iste, temporibus quibusdam ex exercitationem similique. Rem ut impedit molestias vero. Repudiandae dolore, aperiam cum sit illum deserunt tempore numquam magnam natus dolor possimus architecto id eos aspernatur ut ea eius aliquam ad explicabo accusamus.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-amber-900 flex items-center justify-center gap-6 p-3 rounded">
          {[
            { icon: icons.pencilSolidFull, label: "New Chat" },
            { icon: icons.magnifyingGlassSolidFull, label: "Search Chat" },
            { icon: icons.bookSolidFull, label: "Projects" },
            { icon: icons.ellipsisSolidFull, label: "More" },
          ].map((item, i) => (
            <span key={i} className="bg-amber-600 p-2 rounded">
              <Image src={item.icon} alt={item.label} height={50} width={50} />
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Popup

// // import React from 'react'
// import Image from 'next/image'
// import icons from '@/Assets/asset'
// function Popup({ popup, setpopup }) {
//     return (
//         <div className=''>
//             <div className='w-3xl  m-auto p-1.5 border-4 absolute group-hover:opacity-100 transition duration-200 z-50'>
//                 <div className='flex items-center justify-between'>
//                     <h1 className='text-black font-bold text-3xl ml-8 my-4'>this is my first data</h1>
//                     <span>
//                         <Image className='cursor-pointer' onClick={() => setpopup(!popup)} src={icons.xSolidFull} alt='deleteIcon' height={50} width={50} />
//                     </span>
//                 </div>
//                 <hr className='border-amber-300 border-2' />
//                 <div className=' bg-amber-300 mb-2'>
//                     <p className='text-black text-1xl p-2 overflow-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos excepturi harum at, magni amet reprehenderit eum itaque delectus. A reiciendis, quam maxime obcaecati similique explicabo! Quasi at vero quidem inventore ut. Officia, veniam inventore maxime ipsa facere molestias fuga iste. Commodi fugit dolorem eveniet enim architecto in debitis sunt, deleniti ex. Libero eveniet quisquam eos! Itaque asperiores nemo corrupti recusandae veritatis assumenda ut fuga, iure animi minus dolorum, voluptate voluptates quibusdam! Harum, voluptatum hic nesciunt laborum, quidem deleniti nostrum sapiente dolorum consequuntur natus saepe corporis, molestiae eveniet. Nisi tenetur, deserunt dolorem architecto corrupti, iure dolor maxime beatae natus, dolorum fugiat?</p>
//                 </div>
//                 <div className='bg-amber-900 flex items-center justify-center gap-10  p-3 mb-2'>
//                     {[
//                         { icon: icons.pencilSolidFull, label: "New Chat" },
//                         { icon: icons.magnifyingGlassSolidFull, label: "Search Chat" },
//                         { icon: icons.bookSolidFull, label: "Projects" },
//                         { icon: icons.ellipsisSolidFull, label: "More" },
//                     ].map((item, i) => (
//                         <span key={i} className='bg-amber-600 p-1.5 gap-3'>
//                             <Image className='cursor-pointer' src={item.icon} alt={item.label} height={50} width={50} />
//                         </span>
//                     ))}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Popup
import React, { useEffect, useState } from 'react'

function History({ expand }) {

  const [history, sethistory] = useState("")
  console.log("history",history);
  

  useEffect(() => {

    const fetchJistory = async () => {

      const res = await fetch("/Api/history", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })

      if (res) {
        const data = await res.json()
        console.log("data", data);
        
        sethistory(data)
      }



    }
  console.log("fetchJistory",fetchJistory);
  

  }, [])




  return (
    <div className={` ${expand ? 'block' : 'hidden'} px-4 mt-8`}>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        History
      </h2>
      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
        <div className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700">
          History 1
        </div>
      </div>
    </div>
  )
}

export default History
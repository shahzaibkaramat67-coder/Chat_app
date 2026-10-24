"use client";

import React, { useEffect, useState } from "react";

function History({ expand }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/Api/history", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setHistory(Array.isArray(data?.messages) ? data.messages : []);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={`${expand ? "block" : "hidden"} px-4 mt-8`}>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        History
      </h2>

      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div
              key={item._id || index}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
            >
              {item.title || item.content || `History ${index + 1}`}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 rounded-lg text-sm text-gray-400">
            No history yet
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
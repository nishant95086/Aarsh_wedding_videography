import React from "react";

export default function Button({ children = "Click Me", onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-4 rounded-full font-semibold text-white flex items-center justify-center
                 bg-gradient-to-r from-pink-500 to-purple-600
                 hover:from-purple-600 hover:to-pink-500
                 transform hover:scale-105 cursor-pointer
                 transition-all duration-500 ease-in-out
                 shadow-[0_0_15px_#ec4899,0_0_30px_#8b5cf6]
                 hover:shadow-[0_0_25px_#a855f7,0_0_45px_#ec4899]
                 font-Sedan"
    >
      {children}
      {Icon && <Icon className="w-5 h-5 ml-2 my-auto" />}
    </button>
  );
}

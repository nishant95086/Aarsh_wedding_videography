import React from "react";
import Tilt from "../../components/motion-primitives/tilt";

export default function Box({ icon: Icon, num, text, text1 }) {
  return (
    <Tilt>
      <div
        className="bg-gradient-to-tr from-pink-500 to-purple-600 w-80 py-10 sm:w-85
          rounded-xl flex flex-col items-center justify-center 
          text-white h-auto sm:h-70 sm:p-6
          shadow-[0_0_20px_#ec4899,0_0_40px_#8b5cf6]
          hover:shadow-[0_0_30px_#ec4899,0_0_60px_#8b5cf6]
          transition-shadow duration-500 ease-in-out"
      >
        {Icon && <Icon className="w-12 h-12 mb-4" />}
        {num && <p className="text-4xl font-extrabold">{num}+</p>}
        {text && <p className="text-2xl font-bold font-EmilysCandy text-center">{text}</p>}
        {text1 && (
          <p className="text-lg font-semibold mt-1 font-Sedan text-center">{text1}</p>
        )}
      </div>
    </Tilt>
  );
}

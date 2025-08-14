import React from "react";
import Button from "./Button";

export default function Footer({
  qus,
  dic,
  btn1,
  btn2,
  icon1: Icon1,
  icon2: Icon2,
  onClick1 : onClick1,
  onClick2 : onClick2,
}) {
  return (
    <>
      <div className="w-full h-auto py-5 bg-[#262626] mt-5">
        {qus && (
          <p className="text-3xl font-EmilysCandy sm:text-5xl text-center bg-gradient-to-tl from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold py-5">
            {qus}
          </p>
        )}
        {dic && <p className="text-60 font-Sedan sm:text-xl font-Sedan px-3 text-white text-center">{dic}</p>}
        <div className="flex justify-center flex-wrap mt-5 gap-5">
          {btn1 && <Button onClick={onClick1} icon={Icon1}>{btn1}</Button>}
          {btn2 && <Button onClick={onClick2} icon={Icon2}>{btn2}</Button>}
        </div>
      </div>
    </>
  );
}

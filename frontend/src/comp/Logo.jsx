import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logo({className = "w-10 rounded-[50%] cursor-pointer"}){
    const navigate = useNavigate();
    return(
        <img className={`${className}`} src="https://i.ibb.co/HDM3pL86/IMG-4474.png" onClick={()=> navigate('/')}  alt="logo"></img>
    )
}
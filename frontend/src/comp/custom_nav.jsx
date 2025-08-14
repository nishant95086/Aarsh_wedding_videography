// Updated CustomNavLink.js
import React from "react";
import { NavLink } from "react-router-dom";

export default function CustomNavLink({
  to,
  children,
  variant,
  onClick,
  icon,
}) {
  if (variant === "animated") {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `inline-block px-4 py-2 font-semibold text-white 
        bg-gradient-to-r from-pink-500 to-purple-500
        border border-white/40 rounded-full transition-all duration-300 
        ${isActive ? "ring-2 ring-red-500" : ""}`
      }
    >
      <span className="flex items-center gap-2 font-Sedan">
        {icon && React.createElement(icon, { className: "w-4 h-4" })}
        {children}
      </span>
    </NavLink>
  );
}
else {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative 
      bg-gradient-to-r from-pink-500 to-purple-500 font-Sedan bg-clip-text text-transparent
      ${isActive ? "font-bold after:w-full" : "hover:after:w-full after:w-0"} 
      after:content-[''] after:absolute after:left-0 after:-bottom-1 
      after:h-[2px] 
      after:bg-gradient-to-r after:from-pink-500 after:to-purple-500
      after:transition-all after:duration-300 after:ease-in-out font-bold text-xl`
        }
      >
        {children}
      </NavLink>
    );
  }
}

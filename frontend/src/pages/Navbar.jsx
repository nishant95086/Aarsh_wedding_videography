import React from "react";
import {
  FaHome,
  FaUserTie,
  FaImages,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import Logo from "../comp/Logo";
import CustomNavLink from "../comp/custom_nav";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/gallery", label: "Gallery", icon: FaImages },
    { to: "/service", label: "Service", icon: FaUserTie },
    { to: "/about", label: "About", icon: FaUser },
    { to: "/contact", label: "Contact", icon: FaEnvelope },
    { to: "/admin/login", label: "Admin", icon: FaEnvelope },

  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 px-16 py-5 bg-transparent shadow-[0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-md border-b border-gray-300 flex justify-between">
        <div className="flex gap-5 items-center">
          <Logo />
          <p className="font-EmilysCandy bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text px-2 text-transparent font-bold text-[15px] sm:text-xl cursor-pointer" onClick={()=> navigate('/')}>
            AARSH WEDDING VIDEOGRAPHY
          </p>
        </div>

        <div className="hidden lg:flex gap-4">
          {navLinks.map((link) => (
            <CustomNavLink key={link.to} to={link.to}>
              <div className="flex items-center gap-2">
                <link.icon className="text-xl text-pink-500" />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-medium">
                  {link.label}
                </span>
              </div>
            </CustomNavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className=" fixed z-50 top-6 right-3 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white text-3xl z-50 cursor-pointer bg-pink-500  rounded"
        >
          {!isOpen && <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-white/10 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-between p-4">
          <div className="flex gap-2 items-center">
            <Logo className="w-8 rounded-[50%] cursor-pointer" />
            <p className="font-Sedan text-[10px] font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              AARSH WEDDING VIDEOGRAPHY
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl cursor-pointer"
          >
            <FiX className="text-black border-1 border-black p-1 rounded-2xl" />
          </button>
        </div>
        <nav className="flex flex-col px-6 gap-4 mt-6 text-white">
          {navLinks.map((link) => (
            <CustomNavLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              onClick={() => setIsOpen(false)}
              variant="animated"
            >
              {link.label}
            </CustomNavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

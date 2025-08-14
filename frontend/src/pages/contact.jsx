import React, { useRef } from "react";
import ContactForm from "../comp/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../comp/Button";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";
import ScrollProgress from "../../components/motion-primitives/scroll-progress";

export default function Contact() {
  const containerRef = useRef(null);
  const socialIcons = [
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/aarsh_wedding_videography/",
      bg: "bg-gradient-to-tr from-pink-500 to-yellow-500",
      label: "Instagram",
    },
    {
      icon: <FaYoutube />,
      href: "https://www.youtube.com/@ashishgautam591",
      bg: "bg-red-600",
      label: "YouTube",
    },
    {
      icon: <FaMapMarkerAlt />,
      href: "https://www.google.com/maps/place/Aarsh+Wedding+Videography/@25.401327,86.1372157,17z/data=!3m1!4b1!4m6!3m5!1s0x39f21b9b91b4ae07:0x9ba04f8accecac47!8m2!3d25.401327!4d86.1397906!16s%2Fg%2F11vz4zr3w1?entry=ttu&g_ep=EgoyMDI1MDcyOC4wIKXMDSoASAFQAw%3D%3D",
      bg: "bg-blue-600",
      label: "Google Maps",
    },
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-screen overflow-y-scroll scroll-smooth"
      >
        {/* ✅ Scroll bar at top */}
        <ScrollProgress
          containerRef={containerRef}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 z-50"
        />
        <div className="mt-35 text-center">
          <p className="text-4xl px-3 font-EmilysCandy sm:text-6xl text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
            Get In Touch
          </p>
          <p className=" text-60 mx-5 sm:text-xl font-Sedan font-bold text-gray-600 text-center mt-5">
            Ready to create magic together? We'd love to hear about your special
            day and discuss how we can capture your beautiful moments.
          </p>
        </div>
        <div className="flex mt-10 gap-10 justify-between flex-wrap mx-10">
          <ContactForm />
          <div className="w-[90%] max-w-4xl mx-auto h-auto text-center gap-5 bg-white shadow-2xl rounded-2xl p-6 sm:p-10 transition-transform duration-300 hover:scale-105">
            <p className="text-2xl font-EmilysCandy sm:text-3xl text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold mb-6">
              Contact Information
            </p>

            {/* Contact Items */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white p-2 rounded-md shadow-md flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-EmilysCandy text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                    Phone
                  </p>
                  <p className="font-semibold font-Sedan text-sm sm:text-base">
                    +91 7986643195
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white p-2 rounded-md shadow-md flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-EmilysCandy text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                    Email
                  </p>
                  <p className="font-semibold font-Sedan text-[10px] sm:text-base">
                    aarsh.wedding.videography@gmail.com
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white p-2 rounded-md shadow-md flex items-center justify-center">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div className="text-start max-w-xs sm:max-w-md">
                  <p className="text-lg sm:text-xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                    Location
                  </p>
                  <p className="font-semibold font-Sedan text-sm sm:text-base">
                    Santh Nagar Badi, near Vikas Vidyalaya School, Eghu, Durga
                    Asthan, Begusarai, Bihar 851101
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center">
              <Button
                onClick={() =>
                  window.open("https://wa.me/917986643195", "_blank")
                }
                icon={FaWhatsapp}
                className="transition-transform duration-300 hover:scale-110"
              >
                WhatsApp
              </Button>
              <a
                href="mailto:aarsh.wedding.videography@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  icon={MdEmail}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  Email
                </Button>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {socialIcons.map(({ icon, href, bg, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-white text-xl sm:text-2xl ${bg} w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl shadow-[6px_6px_0px_rgba(0,0,0,0.25)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:scale-105`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <footer className="text-center py-6 mt-10 font-Sedan text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} — Made with
            <span className="text-red-500 mx-1">❤️</span>
            by{" "}
            <a
              href="https://www.instagram.com/n.i.s.h.a.n.t.2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-medium"
            >
              Nishant
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

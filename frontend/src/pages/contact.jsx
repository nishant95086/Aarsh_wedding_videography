import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ContactForm from "../comp/ContactForm";
import Button from "../comp/Button";
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
      href: "https://www.google.com/maps/place/Aarsh+Wedding+Videography/",
      bg: "bg-blue-600",
      label: "Google Maps",
    },
  ];

  return (
    <div ref={containerRef} className="relative h-screen overflow-y-scroll scroll-smoot">
      {/* Scroll Progress */}
      <ScrollProgress
        containerRef={containerRef}
        className="fixed top-0 left-0 right-0 h-1 bg-red-500 z-50"
      />

      {/* Title */}
      <div className="text-center mb-12 px-4 pt-24">
        <h1 className="text-4xl sm:text-6xl font-EmilysCandy font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-gray-700 font-Sedan mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
          We’d love to hear from you! Reach out to us through the form or our
          contact details below.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row mt-10 gap-10 justify-center px-4 sm:px-8 max-w-6xl mx-auto">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2"
        >
          <ContactForm />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 bg-white shadow-xl rounded-2xl p-6 sm:p-10 hover:shadow-2xl transition-shadow duration-300"
        >
          <p className="text-2xl sm:text-3xl font-EmilysCandy text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold mb-6">
            Contact Information
          </p>

          {/* Phone */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white rounded-md shadow-md flex items-center justify-center">
              <FontAwesomeIcon icon={faPhone} className="p-2" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
                Phone
              </p>
              <p className="font-semibold font-Sedan text-sm sm:text-base">
                +91 7986643195
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white rounded-md shadow-md flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="p-2" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
                Email
              </p>
              <p className="font-semibold font-Sedan text-sm sm:text-base break-words">
                aarsh.wedding.videography@gmail.com
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-tl from-pink-500 to-purple-500 w-10 h-10 text-white rounded-md shadow-md flex items-center justify-center">
              <FontAwesomeIcon icon={faLocationDot} className="p-2" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
                Location
              </p>
              <p className="font-semibold font-Sedan text-sm sm:text-base max-w-xs sm:max-w-sm">
                Santh Nagar Badi, near Vikas Vidyalaya School, Eghu, Durga
                Asthan, Begusarai, Bihar 851101
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button
              onClick={() => window.open("https://wa.me/917986643195", "_blank")}
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
                className={`text-white text-xl sm:text-2xl ${bg} w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl shadow-md transition-all duration-300 hover:scale-110`}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 mt-10 font-Sedan text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} — Made with{" "}
          <span className="text-red-500 mx-1">❤️</span> by{" "}
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
  );
}

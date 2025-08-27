import React, { useRef } from "react";
import {
  FaUserTie,
  FaEnvelope,
  FaEye,
  FaCogs,
  FaHeart,
  FaCamera,
  FaAward,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "../comp/Button";
import Box from "../comp/box";
import Footer from "../comp/footer";
import { useNavigate } from "react-router-dom";
import ScrollProgress from "../../components/motion-primitives/scroll-progress";
import FloatingReview from "../comp/FloatingReview";

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-scroll scroll-smoot"
    >
      {/* ✅ Scroll bar at top */}
      <ScrollProgress
        containerRef={containerRef}
        className="fixed top-0 left-0 right-0 h-1 bg-red-500 z-50"
      />

      {/* ✅ Hero Section */}
      <div className="relative mt-20 w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Full-width responsive image */}
        <motion.img
          src="https://i.ibb.co/s9HBk3LD/photorealistic-wedding-venue-with-intricate-decor-ornaments.jpg"
          alt="Wedding Venue"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Floating gradient blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-rose-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />

        {/* Text content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 py-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">
            CAPTURING
          </p>
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold text-white">
            MOMENTS THAT
          </p>
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold bg-gradient-to-l from-rose-500 to-violet-600 bg-clip-text text-transparent">
            LAST FOREVER
          </p>
          <p className="text-lg sm:text-xl font-Sedan text-gray-200 max-w-2xl mt-4">
            Professional wedding & event photography that transforms your
            special moments into timeless memories.
          </p>

          <div className="gap-4 flex mt-6 flex-wrap justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/gallery")}
                icon={FaEye}
                className="bg-gradient-to-r from-rose-500 to-violet-600 hover:opacity-90 text-white"
              >
                View Our Work
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/service")}
                icon={FaCogs}
                className="bg-gradient-to-r from-violet-600 to-rose-500 hover:opacity-90 text-white"
              >
                View Our Service
              </Button>
            </motion.div>
          </div>

          {/* ✅ Bouncing Arrows inside hero */}
          <div className="relative flex flex-col items-center space-y-1 mt-10">
            <span className="text-transparent bg-gradient-to-t from-rose-500 to-violet-600 bg-clip-text font-bold text-3xl animate-bounce">
              ↓
            </span>
            <span className="text-transparent bg-gradient-to-t from-rose-500 to-violet-600 bg-clip-text font-bold text-3xl animate-bounce [animation-delay:0.2s]">
              ↓
            </span>
          </div>
        </motion.div>
      </div>

      {/* ✅ About Section */}
      <motion.div
        className="relative mt-20 px-4 z-10"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col text-center items-center">
          <p className="text-4xl sm:text-6xl p-3 font-EmilysCandy font-bold text-transparent bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text">
            About Aarsh Wedding Videography
          </p>
          <p className="text-lg sm:text-xl max-w-3xl font-Sedan my-5 text-gray-500">
            We are passionate storytellers who believe every moment deserves to
            be captured with artistry and emotion. With 8+ years of experience,
            we specialize in creating cinematic memories that you'll treasure
            forever.
          </p>
        </div>

        {/* ✅ Counters */}
        <div className="flex flex-wrap gap-6 justify-center mt-10">
          {[ 
            { icon: FaHeart, num: 500, text: "Happy Couples" },
            { icon: FaCamera, num: 1200, text: "Events Covered" },
            { icon: FaAward, num: 25, text: "Awards Won" },
            { icon: FaCalendarAlt, num: 8, text: "Years Experience" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <Box icon={item.icon} num={item.num} text={item.text} />
            </motion.div>
          ))}
        </div>

        {/* ✅ Services */}
        <div className="flex flex-wrap gap-6 justify-center mt-10">
          {[
            {
              icon: FaHeart,
              text: "Wedding Photography",
              text1:
                "Capturing the magic of your special day with artistic vision and emotional depth",
            },
            {
              icon: FaCamera,
              text: "Event Coverage",
              text1:
                "From intimate gatherings to grand celebrations, we document every precious moment",
            },
            {
              icon: FaAward,
              text: "Cinematic Style",
              text1:
                "Award-winning cinematic approach that makes your memories feel like a beautiful film",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 }}
            >
              <Box icon={item.icon} text={item.text} text1={item.text1} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ✅ Floating Reviews */}
      <FloatingReview />

      {/* ✅ Footer */}
      <Footer
        qus={"Ready to Create Magic?"}
        dic={
          "Let's discuss your vision and create something extraordinary together. Every great story deserves to be told beautifully."
        }
        btn1={"See Our Service"}
        btn2={"Get In Touch"}
        icon1={FaUserTie}
        icon2={FaEnvelope}
        onClick1={() => navigate("/service")}
        onClick2={() => navigate("/contact")}
      />
    </div>
  );
}

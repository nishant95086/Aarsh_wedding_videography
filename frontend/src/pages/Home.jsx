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
      className="relative h-screen overflow-y-scroll scroll-smooth"
    >
      {/* ✅ Scroll bar at top */}
      <ScrollProgress
        containerRef={containerRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 z-50"
      />

      {/* ✅ Hero Section with Full Image */}
      <div className="relative mt-20 w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Full-width responsive image */}
        <img
          src="https://i.ibb.co/s9HBk3LD/photorealistic-wedding-venue-with-intricate-decor-ornaments.jpg"
          alt="Wedding Venue"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 py-5">
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            CAPTURING
          </p>
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold text-white">
            MOMENTS THAT
          </p>
          <p className="lg:text-7xl text-5xl font-EmilysCandy font-bold bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent">
            LAST FOREVER
          </p>
          <p className="text-lg sm:text-xl font-Sedan text-white max-w-2xl mt-4">
            Professional wedding & event photography that transforms your
            special moments into timeless memories.
          </p>

          <div className="gap-4 flex mt-6 flex-wrap justify-center">
            <Button
              onClick={() => navigate("/gallery")}
              icon={FaEye}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              View Our Work
            </Button>
            <Button
              onClick={() => navigate("/service")}
              icon={FaCogs}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              View Our Service
            </Button>
          </div>

          {/* ✅ Bouncing Arrows inside hero */}
          <div className="relative flex flex-col items-center space-y-1 mt-10">
            <span className="text-transparent bg-gradient-to-t from-pink-500 to-purple-500 bg-clip-text font-bold text-3xl animate-bounce">
              ↓
            </span>
            <span className="text-transparent bg-gradient-to-t from-pink-500 to-purple-500 bg-clip-text font-bold text-3xl animate-bounce [animation-delay:0.2s]">
              ↓
            </span>
          </div>
        </div>
      </div>

      {/* ✅ About Section */}
      <div className="relative mt-20 px-4 z-10">
        <div className="flex flex-col text-center items-center">
          <p className="text-4xl sm:text-6xl p-3 font-EmilysCandy font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
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
          <Box icon={FaHeart} num={500} text="Happy Couples" />
          <Box icon={FaCamera} num={1200} text="Events Covered" />
          <Box icon={FaAward} num={25} text="Awards Won" />
          <Box icon={FaCalendarAlt} num={8} text="Years Experience" />
        </div>

        {/* ✅ Services */}
        <div className="flex flex-wrap gap-6 justify-center mt-10">
          <Box
            icon={FaHeart}
            text="Wedding Photography"
            text1="Capturing the magic of your special day with artistic vision and emotional depth"
          />
          <Box
            icon={FaCamera}
            text="Event Coverage"
            text1="From intimate gatherings to grand celebrations, we document every precious moment"
          />
          <Box
            icon={FaAward}
            text="Cinematic Style"
            text1="Award-winning cinematic approach that makes your memories feel like a beautiful film"
          />
        </div>
      </div>

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

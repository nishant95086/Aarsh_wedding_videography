import React, { useRef } from "react";
import Box from "../comp/box";
import Footer from "../comp/footer";
import { Handshake, Trophy, UserCheck } from "lucide-react";
import { FaCamera } from "react-icons/fa";
import { RiGalleryLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ScrollProgress from "../../components/motion-primitives/scroll-progress";

export default function About() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

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
          <p className="text-4xl px-3 sm:text-6xl  py-3 font-EmilysCandy text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
            About Aarsh wedding videography
          </p>
          <p className=" text-60 mx-5 sm:text-xl font-Sedan font-bold text-gray-600 text-center mt-5">
            Passionate storytellers dedicated to capturing the magic of your
            most precious moments
          </p>
        </div>
        <div className=" w-full flex flex-col md:flex-row mt-15">
          <div className="flex-1/2  mx-5">
            <p className="text-3xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
              Our Story
            </p>
            <p className="text-60 sm:text-xl font-Sedan font-bold text-gray-600 mt-5">
              Aarsh wedding videography was born from a simple belief: every
              love story deserves to be told beautifully. What started as a
              passion project between two friends has evolved into a renowned
              photography and cinematography studio that has captured over 500
              beautiful celebrations.
            </p>
            <p className="text-60 sm:text-xl font-Sedan font-bold text-gray-600 mt-5">
              We specialize in creating cinematic experiences that go beyond
              traditional photography. Our approach combines artistic vision
              with technical expertise to create timeless memories that you'll
              treasure forever.
            </p>
            <p className="text-60 sm:text-xl font-Sedan font-bold text-gray-600 mt-5">
              Based in Begusarai(Bihar) but Available throughout India, we've
              had the privilege of documenting love stories across India , each
              one unique and special in its own way.
            </p>
            <div className="flex mt-10 justify-between  lg:mx-20">
              <div className="font-Sedan">
                <p className="text-3xl text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                  500+
                </p>
                <p className="text-xl font-bold text-gray-600 ">Weddings</p>
              </div>
              <div className="font-Sedan">
                <p className="text-3xl text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                  25 +
                </p>
                <p className="text-xl font-bold text-gray-600 ">Awards</p>
              </div>
              <div className="font-Sedan">
                <p className="text-3xl text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                  8+
                </p>
                <p className="text-xl font-bold text-gray-600 ">Years</p>
              </div>
            </div>
          </div>
          <div className="flex-1/2 mx-5 mt-5">
            <iframe
              className="w-full h-100  md:h-[100%] rounded-2xl"
              src="https://www.youtube.com/embed/-0CHL_7rPjg?autoplay=1&mute=1&loop=1&playlist=-0CHL_7rPjg&rel=0"
              title="Aarsh Wedding Videography"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
        <div className="w-full mt-20 text-center">
          <p className="text-4xl font-EmilysCandy text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
            Our Values
          </p>
          <p className="text-xl font-Sedan font-bold text-gray-600 text-center mt-5">
            The principles that guide us in creating exceptional experiences for
            our clients
          </p>
          <div className=" flex flex-wrap lg:justify-between justify-center gap-5 mx-10 mt-10">
            <Box
              icon={FaCamera}
              text={"Artistic Vision"}
              text1={
                "We see beauty in every moment and capture it with artistic flair"
              }
            />
            <Box
              icon={Handshake}
              text={"Emotional Connection"}
              text1={
                "We believe in creating genuine connections to capture authentic emotions"
              }
            />
            <Box
              icon={Trophy}
              text={"Excellence"}
              text1={
                "We believe in creating genuine connections to capture authentic emotionsCommitted to delivering the highest quality work that exceeds expectations"
              }
            />
            <Box
              icon={UserCheck}
              text={"Client-Centered"}
              text1={
                "Your vision and satisfaction are at the heart of everything we do"
              }
            />
          </div>
        </div>
        <div className="text-center mt-20 mx-5">
          <p className="text-2xl sm:text-4xl font-EmilysCandy  text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
            Meet the CEO
          </p>
          <p className="text-60 font-Sedan sm:text-xl font-bold text-gray-600  mt-5">
            The passionate individuals behind every beautiful moment we capture
          </p>
          <div className="flex justify-center flex-wrap mt-5">
            <img
              className="w-50 h-50  rounded-[50%]"
              src="https://i.ibb.co/Zpw0YVBm/IMG-6532.jpg"
              alt=""
            />
            <div className=" mx-10 mt-10">
              <p className="text-2xl font-bold font-Sedan text-gray-600 ">
                Ashish Gautam
              </p>
              <p className="text-xl font-Sedan  text-transparent bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                Creative Director
              </p>
              <p className="text-60 sm:text-xl font-Sedan font-bold sm:w-120 text-gray-600 ">
                Award-winning cinematographer specializing in cinematic wedding
                films.
              </p>
            </div>
          </div>
        </div>

        <div className=" text-center mt-20">
          <p className="text-6xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
            Our Process
          </p>
          <p className="text-xl font-bold mt-5 font-Sedan px-3 text-gray-600 ">
            From consultation to delivery, we ensure a seamless experience
          </p>
          <div className="flex justify-between my-10 flex-wrap gap-5 mx-20">
            <div className=" w-70">
              <p className="w-10 h-10 mx-auto rounded-[50%] bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-[25px]">
                1
              </p>
              <p className="text-xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                Consultation
              </p>
              <p className="text-xl font-bold font-Sedan text-gray-600 ">
                We discuss your vision and requirements
              </p>
            </div>
            <div className=" w-70">
              <p className="w-10 h-10 mx-auto rounded-[50%] bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-[25px]">
                2
              </p>
              <p className="text-xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                Planning
              </p>
              <p className="text-xl font-bold font-Sedan text-gray-600 ">
                Detailed timeline and shot list preparation
              </p>
            </div>
            <div className=" w-70">
              <p className="w-10 h-10 mx-auto rounded-[50%] bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-[25px]">
                3
              </p>
              <p className="text-xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                Capture
              </p>
              <p className="text-xl font-bold font-Sedan text-gray-600 ">
                Professional photography on your special day
              </p>
            </div>
            <div className=" w-70">
              <p className="w-10 h-10 mx-auto rounded-[50%] bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-[25px]">
                4
              </p>
              <p className="text-xl text-transparent font-EmilysCandy bg-gradient-to-tr from-pink-500 to-purple-500 bg-clip-text font-bold">
                Delivery
              </p>
              <p className="text-xl font-bold font-Sedan text-gray-600 ">
                Edited photos and videos within 4 weeks
              </p>
            </div>
          </div>
        </div>

        <Footer
          qus={"Ready to Work Together?"}
          dic={
            "Let's create something beautiful together. Contact us to discuss your project."
          }
          btn1={"View the Magic"}
          icon1={RiGalleryLine}
          onClick1={() => navigate("/gallery")}
        />
      </div>
    </>
  );
}

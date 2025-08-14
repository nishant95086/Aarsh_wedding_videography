import React,{useRef} from "react";
import ServiceBox from "../comp/ServiceBox";
import services from "../data/service";
import Footer from "../comp/footer";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ScrollProgress from "../../components/motion-primitives/scroll-progress";

export default function Service() {
  const navigate = useNavigate();
  const containerRef = useRef(null); 
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
      <div className="flex flex-col text-center items-center">
        <h1 className="text-4xl sm:text-6xl font-EmilysCandy mt-40 font-bold bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent p-4">
          About Our Services
        </h1>
        <p className=" text-60 font-Sedan sm:text-xl mx-15 font-bold text-gray-600 text-center">
          Passionate creators bringing your celebrations to life with heart,
          art, and precision. From unforgettable visuals to vibrant performances
          — we craft every moment with care.
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-6 px-4 py-10 mt-10 sm:mt-20">
        {services.map((service, index) => (
          <ServiceBox
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            features={service.features}
          />
        ))}
      </div>
      <Footer
        qus={"Planning Something Special?"}
        dic={"Together, we’ll turn it into an unforgettable experience."}
        btn1={"Let’s Talk"}
        icon1={MdOutlineConnectWithoutContact}
        onClick1={() => navigate("/contact")}
      />
      </div>
    </>
  );
}

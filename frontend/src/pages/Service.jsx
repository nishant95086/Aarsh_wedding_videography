import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Video,
  Baby,
  Gift,
  Cake,
  Image,
  Star,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "../comp/footer";

const services = [
  {
    icon: Camera,
    title: "Basic Wedding Package",
    description: "Perfect for intimate weddings with essential coverage and elegant photography.",
    features: [
      "1 Professional Photographer",
      "2 Professional Videographers",
      "300+ Edited Photos",
      "Online Gallery & USB",
      "Same Week Delivery"
    ],
    gradient: "from-pink-500 to-purple-500",
  },
  {
    icon: Camera,
    title: "Event Photography Package",
    description: "Professional event coverage capturing every highlight and candid moment.",
    features: [
      "2 Professional Photographers",
      "250+ High-Res Photos",
      "4-6 Hour Coverage",
      "Digital Download"
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Camera,
    title: "Portrait Session",
    description: "Professional portrait photography designed to bring out your best self.",
    features: [
      "60 Minute Session",
      "25+ Retouched Photos",
      "Studio or Outdoor",
      "Wardrobe Guidance"
    ],
    gradient: "from-fuchsia-500 to-purple-500",
  },
  {
    icon: Video,
    title: "Wedding Videography",
    description: "Cinematic wedding films that capture every emotion and moment of your special day.",
    features: [
      "Cinematic Storytelling",
      "Drone & Multi-Angle Shots",
      "Highlight & Full Videos",
      "4K Resolution Delivery"
    ],
    gradient: "from-pink-600 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Pre-Wedding Shoot",
    description: "Romantic pre-wedding photography sessions in beautiful outdoor or studio locations.",
    features: [
      "Creative Concept Planning",
      "Multiple Outfit Changes",
      "Candid & Posed Shots",
      "Edited Digital Album"
    ],
    gradient: "from-purple-600 to-fuchsia-500",
  },
  {
    icon: Baby,
    title: "Maternity Photography",
    description: "Capture the beauty of motherhood with elegant maternity portraits.",
    features: [
      "Studio or Outdoor Session",
      "Theme-Based Props",
      "High-Resolution Photos",
      "Professional Retouching"
    ],
    gradient: "from-pink-500 to-purple-400",
  },
  {
    icon: Gift,
    title: "Engagement Photography",
    description: "Celebrate your engagement with beautiful, candid photography sessions.",
    features: [
      "Outdoor or Indoor Setup",
      "Posed & Candid Shots",
      "Custom Lighting",
      "Edited Digital Gallery"
    ],
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Cake,
    title: "Anniversary Photography",
    description: "Mark your milestones with elegant anniversary photography sessions.",
    features: [
      "Couple Portraits",
      "Decor & Props Support",
      "Candid Coverage",
      "Edited Photo Collection"
    ],
    gradient: "from-fuchsia-600 to-purple-500",
  },
  {
    icon: Image,
    title: "Photo Editing & Retouching",
    description: "Professional photo enhancement and retouching services for perfect results.",
    features: [
      "Color Correction",
      "Skin Smoothing",
      "Background Enhancement",
      "Custom Editing Requests"
    ],
    gradient: "from-pink-400 to-purple-600",
  },
  {
    icon: Star,
    title: "Premium Packages",
    description: "All-inclusive photo and video bundles with extra services for a stress-free experience.",
    features: [
      "Photo + Video Combo",
      "Pre-Wedding & Engagement",
      "Albums & Online Galleries",
      "Lifetime Cloud Storage"
    ],
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function Service() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 md:w-96 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 md:w-[500px] md:h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 md:w-96 md:h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div ref={containerRef} className="relative">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center pt-16 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4 md:mb-6"
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              ✨ Our Services
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6 px-4">
            About Our Services
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            Passionate creators bringing your celebrations to life with heart, art,
            and precision. From unforgettable visuals to vibrant performances —
            we craft every moment with care.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative w-full"
              >
                <div className="h-full bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-purple-100 transition-all duration-300">
                  <div className={`h-1.5 md:h-2 bg-gradient-to-r ${service.gradient}`}></div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4 md:mb-6">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                    <ul className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3">
                          <div className={`mt-0.5 md:mt-1 flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center`}>
                            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                          </div>
                          <span className="text-gray-700 text-xs md:text-sm leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/contact')}
                      className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2 group-hover:shadow-lg transition-all duration-300 hover:gap-3`}
                    >
                      Choose Package
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  {index === 9 && (
                    <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3" fill="currentColor" />
                        Popular
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Footer
            qus="Planning Something Special?"
            dic="Together, we’ll turn it into an unforgettable experience."
            btn1="Let’s Talk"
            icon1={MdOutlineConnectWithoutContact}
            onClick1={() => navigate("/contact")}
          />
        </motion.div>
      </div>
    </div>
  );
}

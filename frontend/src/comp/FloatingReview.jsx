import React from "react";
import "./FloatingReview.css";

const reviewImages = [
  "https://i.ibb.co/tPYP5Gg6/Screenshot-2025-08-05-091818.png",
  "https://i.ibb.co/XrsvF9TH/Screenshot-2025-08-05-092342.png",
  "https://i.ibb.co/H6ZFKrH/Screenshot-2025-08-05-092730.png",
  "https://i.ibb.co/dJpf8CyN/Screenshot-2025-08-05-094035.png",
  "https://i.ibb.co/JVLmDxG/Screenshot-2025-08-05-094527.png",
  "https://i.ibb.co/wFmJySJW/Screenshot-2025-08-05-095701.png",
  "https://i.ibb.co/JRpL7wJm/Screenshot-2025-08-05-101438.png",
  "https://i.ibb.co/wZ01J2HY/Screenshot-2025-08-05-101957.png"
];

const FloatingReview = () => {
  return (
    <div className="w-full overflow-hidden bg-white py-4 my-10">
      <h1 className="text-4xl sm:text-6xl font-EmilysCandy font-bold bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent p-4 text-center">
        Reviews
      </h1>

      <div className="mt-4">
        <div className="marquee-reverse">
          {reviewImages.map((img, i) => (
            <img
              key={`review-${i}`}
              src={img}
              alt={`Review ${i}`}
              className="inline-block mx-4 h-80 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingReview;
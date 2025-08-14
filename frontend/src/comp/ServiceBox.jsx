import React from "react";
import Tilt from "../../components/motion-primitives/tilt";

export default function ServiceBox({
  icon: Icon,
  title,
  description,
  features = []
}) {
  return (
    <Tilt>
      <div
        className="w-80 py-5 sm:w-96 sm:h-85
          bg-gradient-to-tr from-pink-500 to-purple-600 
          rounded-xl flex flex-col items-center justify-center 
          text-white h-auto sm:p-6
          shadow-[0_0_20px_#ec4899,0_0_40px_#8b5cf6]
          hover:shadow-[0_0_30px_#ec4899,0_0_60px_#8b5cf6]
          transition-shadow duration-500 ease-in-out text-center"
      >
        {Icon && <Icon className="w-10 h-10 mb-3 text-white" />}
        {title && <h3 className="text-2xl font-EmilysCandy font-bold mb-2">{title}</h3>}
        {description && <p className="text-base mb-3">{description}</p>}
        {features.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}
      </div>
    </Tilt>
  );
}

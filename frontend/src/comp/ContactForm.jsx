import React, { useState } from "react";
import emailjs from "emailjs-com";
import Button from "./Button";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    date: "",
    eventType: "",
    description: "",
  });

  const [status, setStatus] = useState(null); // "success" or "error"

  const services = [
    "Photography",
    "Food Catering",
    "Decorations",
    "Grand Entry - Hip Hop",
    "Grand Entry - Traditional",
    "Singers",
    "Dancers",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          setStatus("success");
          setFormData({
            name: "",
            number: "",
            date: "",
            eventType: "",
            description: "",
          });
        },
        (error) => {
          console.error("FAILED...", error.text);
          setStatus("error");
        }
      );
  };

  return (
    <div className="w-xl mx-auto bg-white shadow-2xl rounded-2xl p-10 transition-transform duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-tl font-EmilysCandy from-pink-500 to-purple-500 bg-clip-text mb-4">
        Contact Us for Your Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-Sedan font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full font-Sedan p-2 border border-gray-300 rounded"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-Sedan font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            name="number"
            required
            value={formData.number}
            onChange={handleChange}
            className="mt-1 w-full font-Sedan p-2 border border-gray-300 rounded"
            placeholder="e.g. 7986643195"
          />
        </div>

        <div>
          <label className="block text-sm font-Sedan font-medium">
            Event Date
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full font-Sedan p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-Sedan font-medium">
            Event Type
          </label>
          <select
            name="eventType"
            required
            value={formData.eventType}
            onChange={handleChange}
            className="mt-1 w-full font-Sedan p-2 border border-gray-300 rounded"
          >
            <option value="">-- Select Service --</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-Sedan text-sm font-medium">
            Event Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 w-full font-Sedan p-2 border border-gray-300 rounded"
            placeholder="Describe your event, special requests, ideas etc."
          ></textarea>
        </div>

        <Button icon={PaperAirplaneIcon}>Submit</Button>

        {status === "success" && (
          <p className="text-green-600 font-Sedan mt-2">
            Your message has been sent!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-Sedan mt-2">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;

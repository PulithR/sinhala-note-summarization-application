import React, { useState, useEffect, useRef } from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = ({ darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setFormStatus({
        message: "Please enter a valid email address",
        type: "error",
      });
      return;
    }
    setFormStatus({
      message: "Thank you for subscribing!",
      type: "success",
    });
    setEmail("");
    setTimeout(() => setFormStatus({ message: "", type: "" }), 3000);
  };

  return (
    <footer ref={sectionRef} className={`relative pt-16 pb-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600" />
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-10">
            <div className="flex items-center">
              <img src="/img/kuppi-icon.png" alt="Kuppi Icon" className="w-12 h-12 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Kuppi
              </span>
            </div>
            <p className={`${darkMode ? "text-white-400" : "text-gray-600"} max-w-xs`}>
              Revolutionizing Sinhala education through AI-powered learning solutions for students across Sri Lanka.
            </p>
            <div className="flex space-x-4">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`text-2xl ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Visit our ${
                     index === 1 ? "Facebook" : index === 2 ? "Instagram" : "LinkedIn"
                  } page`}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {["Home", "Features", "Testimonials", "Team"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`${
                      darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    } hover:translate-x-2 transition-transform duration-200 inline-block`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: "kuppics50@gmail.com" },
                { icon: Phone, text: "+94 11 234 5678" },
                { icon: MapPin, text: "Colombo, Sri Lanka" },
              ].map(({ icon: Icon, text }, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Subscription Form (from Contact component) */}
          <motion.div
            className="max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className={`mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Subscribe for exclusive Sinhala learning tips and updates on new features.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode ? "bg-gray-800 text-white" : "bg-gray-50"
                  } border ${
                    formStatus.type === "error" ? "border-red-500" : darkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                  aria-label="Email address for newsletter subscription"
                />
                {formStatus.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-sm ${formStatus.type === "error" ? "text-red-500" : "text-green-500"}`}
                  >
                    {formStatus.message}
                  </motion.p>
                )}
              </div>
              <motion.button
                type="submit"
                className="w-full px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
        <div className={`pt-8 mt-8 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"} >
              © {new Date().getFullYear()} Kuppi. All rights reserved.
            </p>
            {/* <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`${
                    darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  } text-sm transition-colors duration-200`}
                >
                  {item}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const Nav = ({ darkMode, setDarkMode, scrolled, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sections = ["Home", "Features", "Testimonials", "Team"];

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-opacity-90 backdrop-blur-lg" : "py-4"
      } ${darkMode ? "bg-gray-900" : "bg-white"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          <img src="/img/kuppi-icon.png" alt="Kuppi Icon" className="inline-block w-12 h-12 mr-2" />
          Kuppi
        </motion.div>
        <div className="hidden md:flex items-center space-x-8">
          {sections.map((item) => (
            <motion.button
              key={item}
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              } ${activeSection === item.toLowerCase() ? "border-b-2 border-purple-600" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById(item.toLowerCase()).scrollIntoView({ behavior: "smooth" })}
              aria-label={`Navigate to ${item} section`}
            >
              {item}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>
        </div>
        <motion.button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className={`px-4 py-2 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              {sections.map((item) => (
                <motion.button
                  key={item}
                  className={`block w-full text-left py-2 ${
                    darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ x: 10 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 300); // Wait for menu close animation
                  }}
                  aria-label={`Navigate to ${item} section`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
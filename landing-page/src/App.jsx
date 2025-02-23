import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import Footer from "./components/Footer";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
      const sections = ["home", "features", "testimonials", "team", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Nav darkMode={darkMode} setDarkMode={setDarkMode} scrolled={scrolled} activeSection={activeSection} />
      <Home />
      <Features darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <Team darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMockup, setCurrentMockup] = useState(0);

  const mockupImages = [
    "/img/signup.jpg",
    "/img/otp-modal.jpg",
    "/img/login.jpg",
    "/img/home.jpg",
    "/img/summarizer.jpg",
    "/img/notebook.jpg",
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      setCurrentMockup((prev) => (prev + 1) % mockupImages.length);
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mockupImages.length]);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-purple-800 to-blue-500 pt-16 flex items-center justify-center"
    >
      {/* Animated Background Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen filter blur-xl opacity-30"
          animate={{
            x: [0, mousePosition.x * (30 + i * 10)],
            y: [0, mousePosition.y * (30 + i * 10)],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2,
          }}
          style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            background: `linear-gradient(45deg, ${["#ff49a1", "#ff49db", "#7928ca", "#4338ca"][i % 4]}, transparent)`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`,
          }}
        />
      ))}

      {/* Content Container */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl">
        {/* Text Content and Stats Combined */}
        <motion.div
          className="flex-1 text-center lg:text-left text-white z-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm mt-8 mb-8 mx-auto lg:mx-0"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-base">AI-Powered Learning Platform</span>
          </motion.div>
          
          <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Master Sinhala</span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text">
              with KUPPI
            </span>
          </h1>
          
          <p className="text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed">
            Summarize notes, Scan documents, Organize notes and Ask questions in Sinhala.
          </p>

          {/* Stats Section - Now in single row */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex justify-between items-center">
              {[
                { label: "Active Users", value: "pending..." },
                { label: "Course Completion", value: "pending..." },
                { label: "Learning Hours", value: "pending..." },
                { label: "AI Responses", value: "pending..." },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="text-lg  font-bold mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Mockup Slider */}
        <motion.div
          className="flex-1 flex justify-center max-w-md lg:max-w-lg relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full aspect-[4/5] max-w-sm relative rounded-md overflow-hidden">
            {/* Reduced rounded corners from 'rounded-lg' to 'rounded-md' for a smaller curve */}
            <motion.img
              key={currentMockup}
              src={mockupImages[currentMockup]}
              alt={`App Mockup ${currentMockup + 1}`}
              className="w-full h-full object-contain rounded-md"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, FileText, ScanLine } from "lucide-react";

const ModernFeatureCard = ({ title, description, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          initial={false}
          animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
          className="mb-6 inline-block"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600">
            <Icon className="w-8 h-8 text-white dark:text-gray-100" />
          </div>
        </motion.div>
        <motion.h3
          className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
          animate={isHovered ? { y: -5 } : { y: 0 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-gray-600 dark:text-gray-300 leading-relaxed"
          animate={isHovered ? { y: -3 } : { y: 0 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400"
          initial={{ scaleX: 0 }}
          animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const Features = ({ darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: BookOpen,
      title: "සිංහල Note Summarizer",
      description: "Transform lengthy study materials into concise, easy-to-understand summaries using our AI-powered Sinhala note summarization tool.",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Answers",
      description: "Get instant, accurate answers to your questions with our advanced AI system trained specifically for Sinhala educational content.",
    },
    {
      icon: FileText,
      title: "Smart Note Taking",
      description: "Create, organize, and access your study notes with intelligent categorization and seamless synchronization across devices.",
    },
    {
      icon: ScanLine,
      title: "Document Scanner",
      description: "Quickly digitize your printed study materials with our advanced OCR technology optimized for Sinhala text recognition.",
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`py-24 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          Why Choose Kuppi?
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <ModernFeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
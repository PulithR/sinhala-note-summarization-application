import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {  FaLinkedin, FaGithub } from "react-icons/fa";
import data from "../data/data.json"; // Import the data

const Team = ({ darkMode }) => {
  const team = data.team; // Use the team data from JSON

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

  return (
    <section
      id="team"
      ref={sectionRef}
      className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          Meet Our Team
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className={`p-6 rounded-xl text-center ${
                darkMode ? "bg-gray-700" : "bg-white"
              } shadow-lg`}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <motion.img
                src={member.image}
                alt={`${member.name}, ${member.role}`}
                className="w-36 h-36 rounded-full mx-auto mb-4 object-cover"
                whileHover={{ scale: 1.1 }}
                loading="lazy"
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p
                className={`mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {member.role}
              </p>
              <p className="text-sm mb-4">{member.bio}</p>
              <div className="flex justify-center space-x-4">
                {Object.entries(member.social).map(([platform, link]) => (
                  <motion.a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-lg ${
                      darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Visit ${member.name}'s ${platform} profile`}
                  >
                    {platform === "linkedin" && <FaLinkedin />}
                    {platform === "github" && <FaGithub />}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
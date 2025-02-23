import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import data from "../data/data.json"; // Import the data

const Testimonials = ({ darkMode }) => {
  const testimonials = data.testimonials; // Use the testimonials data from JSON

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const visibleCount = 3;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prev) => Math.min(prev + 1, maxIndex)),
    onSwipedRight: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
  });

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
    <section id="testimonials" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          What Our Users Say
        </motion.h2>
        <div className="relative max-w-4xl mx-auto" {...handlers}>
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: -activeIndex * 300 }}
              transition={{ duration: 0.5 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-72 mx-2.5">
                  <div
                    className={`p-6 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile`}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                      loading="lazy"
                    />
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-center italic mb-4">
                      "{testimonial.text}"
                    </p>
                    <div className="text-center">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p
                        className={`${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <button
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-lg ${
              activeIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "bg-white dark:bg-gray-800"
            }`}
            disabled={activeIndex === 0}
            aria-label="Slide testimonials left"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, maxIndex))}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-lg ${
              activeIndex === maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "bg-white dark:bg-gray-800"
            }`}
            disabled={activeIndex === maxIndex}
            aria-label="Slide testimonials right"
          >
            <ArrowRight className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
"use client";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  isDark: boolean;
}

export const AnimatedBackground = ({ isDark }: AnimatedBackgroundProps) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none w-full">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl ${
          isDark ? "bg-purple-600/10 opacity-30" : "bg-indigo-400 opacity-20"
        }`}
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl ${
          isDark ? "bg-blue-600/10 opacity-30" : "bg-purple-400 opacity-20"
        }`}
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      />
    </div>
  );
};

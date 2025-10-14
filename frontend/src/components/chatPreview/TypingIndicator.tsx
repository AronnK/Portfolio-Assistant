"use client";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  isDark: boolean;
}

export const TypingIndicator = ({ isDark }: TypingIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-3"
    >
      <div
        className={`p-2 rounded-lg ${
          isDark
            ? "bg-purple-600/20 text-purple-400"
            : "bg-indigo-500/20 text-indigo-600"
        }`}
      >
        <Bot className="w-4 h-4" />
      </div>
      <div
        className={`p-4 rounded-2xl rounded-bl-none ${
          isDark
            ? "bg-slate-800/70 border border-slate-700/50"
            : "bg-white/60 border border-white/50"
        }`}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-gray-500" : "bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

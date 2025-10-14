"use client";
import { motion } from "framer-motion";
import { Bot, RefreshCw } from "lucide-react";

interface ChatHeaderProps {
  isDark: boolean;
  onReset: () => void;
}

export const ChatHeader = ({ isDark, onReset }: ChatHeaderProps) => {
  return (
    <div
      className={`px-6 py-4 border-b backdrop-blur-xl ${
        isDark
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/30 border-white/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`p-2.5 rounded-xl ${
              isDark
                ? "bg-gradient-to-br from-purple-600 to-blue-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-500"
            }`}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2
              className={`text-lg font-bold ${
                isDark ? "text-gray-100" : "text-slate-900"
              }`}
            >
              Portfolio Assistant
            </h2>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-slate-500"
                }`}
              >
                Online • Ready to help
              </p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-slate-800 text-gray-400 hover:text-gray-300"
              : "hover:bg-slate-100 text-slate-600 hover:text-slate-700"
          }`}
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

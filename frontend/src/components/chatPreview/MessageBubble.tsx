"use client";
import { motion } from "framer-motion";
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface MessageBubbleProps {
  message: Message;
  isDark: boolean;
}

export const MessageBubble = ({ message, isDark }: MessageBubbleProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring" }}
      className={`flex items-start gap-3 ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-2 rounded-lg shrink-0 ${
            isDark
              ? "bg-purple-600/20 text-purple-400"
              : "bg-indigo-500/20 text-indigo-600"
          }`}
        >
          <Bot className="w-4 h-4" />
        </motion.div>
      )}

      <div className="flex flex-col max-w-[70%]">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-2xl relative group ${
            message.isUser
              ? isDark
                ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-900/30"
                : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-indigo-500/30"
              : isDark
              ? "bg-slate-800/70 text-gray-200 rounded-bl-none border border-slate-700/50"
              : "bg-white/60 text-slate-900 rounded-bl-none border border-white/50"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>

          {!message.isUser && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -bottom-8 left-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? "bg-slate-800 text-gray-400 hover:text-gray-300"
                    : "bg-white text-slate-600 hover:text-slate-700"
                }`}
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? "bg-slate-800 text-gray-400 hover:text-green-400"
                    : "bg-white text-slate-600 hover:text-green-600"
                }`}
                title="Good response"
              >
                <ThumbsUp className="w-3 h-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? "bg-slate-800 text-gray-400 hover:text-red-400"
                    : "bg-white text-slate-600 hover:text-red-600"
                }`}
                title="Bad response"
              >
                <ThumbsDown className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <span
          className={`text-xs mt-1 ${
            message.isUser ? "text-right" : "text-left"
          } ${isDark ? "text-gray-600" : "text-slate-400"}`}
        >
          {message.timestamp}
        </span>
      </div>

      {message.isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-2 rounded-lg shrink-0 ${
            isDark
              ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
              : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
          }`}
        >
          <User className="w-4 h-4" />
        </motion.div>
      )}
    </motion.div>
  );
};

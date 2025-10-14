"use client";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isDark: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isLoading,
  isDark,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className={`p-4 border-t backdrop-blur-xl ${
        isDark
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/30 border-white/30"
      }`}
    >
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-3 rounded-xl resize-none transition-all duration-300 ${
              isDark
                ? "bg-slate-900/70 border border-slate-800/70 text-gray-200 placeholder-gray-600 focus:border-purple-600/70 focus:ring-2 focus:ring-purple-600/30"
                : "bg-white/50 border border-slate-200/50 text-slate-900 placeholder-slate-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            } focus:outline-none`}
            placeholder="Ask about skills, experience, projects..."
            disabled={isLoading}
            rows={1}
          />
          <div
            className={`absolute bottom-2 right-2 text-xs ${
              isDark ? "text-gray-600" : "text-slate-400"
            }`}
          >
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
            isLoading || !value.trim()
              ? isDark
                ? "bg-slate-800 text-gray-600 cursor-not-allowed"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              : isDark
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
          }`}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
      <p
        className={`text-xs mt-2 text-center ${
          isDark ? "text-gray-600" : "text-slate-400"
        }`}
      >
        Press Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
};

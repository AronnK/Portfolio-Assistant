"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isDark: boolean;
  className?: string;
}

export const GradientButton = ({
  children,
  onClick,
  disabled,
  isDark,
  className = "",
}: GradientButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
        disabled
          ? "bg-slate-700 cursor-not-allowed opacity-50"
          : isDark
          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/30"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};

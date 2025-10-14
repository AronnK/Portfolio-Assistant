"use client";
import { motion } from "framer-motion";

interface StatusIndicatorProps {
  isDark: boolean;
  label?: string;
}

export const StatusIndicator = ({
  isDark,
  label = "All systems operational",
}: StatusIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-green-500"
      />
      <span
        className={`text-xs ${isDark ? "text-gray-500" : "text-slate-600"}`}
      >
        {label}
      </span>
    </div>
  );
};

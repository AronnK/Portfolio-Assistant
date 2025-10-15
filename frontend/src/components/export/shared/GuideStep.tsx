"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GuideStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  isDark: boolean;
  delay?: number;
}

export const GuideStep = ({
  stepNumber,
  title,
  description,
  children,
  isDark,
  delay = 0,
}: GuideStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-5 rounded-xl border ${
        isDark
          ? "bg-slate-900/50 border-slate-800"
          : "bg-white/50 border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isDark
              ? "bg-purple-600/20 text-purple-400"
              : "bg-indigo-500/20 text-indigo-600"
          }`}
        >
          {stepNumber}
        </div>
        <div className="flex-1">
          <h4
            className={`text-lg font-semibold mb-2 ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            {title}
          </h4>
          <p
            className={`text-sm mb-4 ${
              isDark ? "text-gray-500" : "text-slate-600"
            }`}
          >
            {description}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

"use client";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  isDark: boolean;
  showOnMobile?: boolean;
}

export const StepIndicator = ({
  currentStep,
  totalSteps = 3,
  isDark,
  showOnMobile = false,
}: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      className={`${
        showOnMobile ? "flex" : "hidden md:flex"
      } items-center space-x-2`}
    >
      {steps.map((num) => (
        <div key={num} className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: num * 0.1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              num < currentStep
                ? isDark
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white"
                : num === currentStep
                ? isDark
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                  : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                : isDark
                ? "bg-slate-800 text-slate-600"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {num}
          </motion.div>

          {num < totalSteps && (
            <div
              className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                num < currentStep
                  ? isDark
                    ? "bg-green-600"
                    : "bg-green-500"
                  : isDark
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

"use client";
import { SlideIn } from "../animations/SlideIn";
import { RotatingIcon } from "../animations/RotatingIcon";
import { ThemeToggle } from "../ui/ThemeToggle";
import { StepIndicator } from "../StepIndicator";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

interface AppHeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  currentStep: number;
}

export const AppHeader = ({
  isDark,
  onThemeToggle,
  currentStep,
}: AppHeaderProps) => {
  return (
    <SlideIn direction="top">
      <header
        className={`backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? "bg-slate-950/90 border-slate-800/50"
            : "bg-white/80 border-slate-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:grid md:grid-cols-3 items-center h-16 gap-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <RotatingIcon
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-500"
                }`}
              >
                <Bot className="w-5 h-5 text-white" />
              </RotatingIcon>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  Portfolio AI
                </h1>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Intelligent Portfolio Assistant
                </p>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <StepIndicator
                currentStep={currentStep}
                isDark={isDark}
                showOnMobile={false}
              />
            </div>

            <div className="flex justify-end">
              <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <RotatingIcon
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-500"
                }`}
              >
                <Bot className="w-5 h-5 text-white" />
              </RotatingIcon>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  Portfolio AI
                </h1>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Intelligent Portfolio Assistant
                </p>
              </div>
            </motion.div>

            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          </div>

          <div className="md:hidden pb-4 flex justify-center">
            <StepIndicator
              currentStep={currentStep}
              isDark={isDark}
              showOnMobile={true}
            />
          </div>
        </div>
      </header>
    </SlideIn>
  );
};

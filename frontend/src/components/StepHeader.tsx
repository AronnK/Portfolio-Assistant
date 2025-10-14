"use client";
import { FadeIn } from "./animations/FadeIn";
import { ScaleIn } from "./animations/ScaleIn";
import { LucideIcon } from "lucide-react";

interface StepHeaderProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isDark: boolean;
}

export const StepHeader = ({
  step,
  title,
  description,
  icon: Icon,
  isDark,
}: StepHeaderProps) => {
  return (
    <FadeIn className="text-center mb-8">
      <ScaleIn className="inline-flex items-center justify-center mb-4">
        <div
          className={`p-4 rounded-2xl ${
            isDark
              ? "bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/20"
              : "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
          }`}
        >
          <Icon
            className={`w-8 h-8 ${
              isDark ? "text-purple-400" : "text-indigo-600"
            }`}
          />
        </div>
      </ScaleIn>
      <h2
        className={`text-3xl sm:text-4xl font-bold mb-2 ${
          isDark ? "text-gray-100" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <p
        className={`text-sm sm:text-base ${
          isDark ? "text-gray-500" : "text-slate-600"
        }`}
      >
        Step {step} of 3 • {description}
      </p>
    </FadeIn>
  );
};

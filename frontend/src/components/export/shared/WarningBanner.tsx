"use client";
import { AlertCircle } from "lucide-react";

interface WarningBannerProps {
  message: string;
  isDark: boolean;
}

export const WarningBanner = ({ message, isDark }: WarningBannerProps) => {
  return (
    <div
      className={`flex items-start gap-2 text-xs p-3 rounded-lg ${
        isDark
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};

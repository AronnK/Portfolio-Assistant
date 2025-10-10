"use client";
import { ReactNode } from "react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { AppHeader } from "./header";
import { AppFooter } from "./footer";

interface PageContainerProps {
  children: ReactNode;
  isDark: boolean;
  currentStep: number;
  onThemeToggle: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const PageContainer = ({
  children,
  isDark,
  currentStep,
  onThemeToggle,
  showHeader = true,
  showFooter = true,
}: PageContainerProps) => {
  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden w-full max-w-full">
        {showHeader && (
          <AppHeader
            isDark={isDark}
            onThemeToggle={onThemeToggle}
            currentStep={currentStep}
          />
        )}

        <main className="flex-1 w-full px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </main>

        {showFooter && <AppFooter isDark={isDark} />}
      </div>
    </div>
  );
};

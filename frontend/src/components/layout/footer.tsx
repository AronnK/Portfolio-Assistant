"use client";
import { SlideIn } from "../animations/SlideIn";
import { StatusIndicator } from "../ui/StatusIndicator";

interface AppFooterProps {
  isDark: boolean;
}

export const AppFooter = ({ isDark }: AppFooterProps) => {
  return (
    <SlideIn direction="bottom" delay={0.2}>
      <footer
        className={`backdrop-blur-xl border-t transition-colors duration-300 ${
          isDark
            ? "bg-slate-950/90 border-slate-800/50"
            : "bg-white/80 border-slate-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-slate-600"
              }`}
            >
              Powered by AI • Built for professionals
            </p>
            <StatusIndicator isDark={isDark} />
          </div>
        </div>
      </footer>
    </SlideIn>
  );
};

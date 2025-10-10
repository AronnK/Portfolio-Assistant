"use client";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

interface BuildBotFooterProps {
  enrichedItems: number;
  totalItems: number;
  isLoading: boolean;
  onBuildBot: () => void;
  isDark: boolean;
}

export const BuildBotFooter = ({
  enrichedItems,
  totalItems,
  isLoading,
  onBuildBot,
  isDark,
}: BuildBotFooterProps) => {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-300 ${
        isDark
          ? "bg-slate-950/90 border-slate-800/50"
          : "bg-white/80 border-white/30"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}
          >
            <span className="font-medium">{enrichedItems}</span> of {totalItems}{" "}
            items enriched
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-xs flex items-center space-x-1 ${
              isDark ? "text-gray-600" : "text-slate-400"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>More context = Smarter AI</span>
          </motion.div>
        </div>

        <GradientButton
          onClick={onBuildBot}
          disabled={isLoading}
          isDark={isDark}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Building Your AI Assistant...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Build My Bot & Start Preview</span>
            </>
          )}
        </GradientButton>
      </div>
    </motion.footer>
  );
};

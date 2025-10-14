"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  isDark: boolean;
  className?: string;
  hoverScale?: boolean;
  padding?: boolean;
  noBorder?: boolean;
}

export const GlassCard = ({
  children,
  isDark,
  className = "",
  hoverScale = false,
  padding = true,
  noBorder = false,
}: GlassCardProps) => {
  const MotionComponent = hoverScale ? motion.div : "div";
  const motionProps = hoverScale ? { whileHover: { scale: 1.02 } } : {};

  return (
    <MotionComponent
      {...motionProps}
      className={`backdrop-blur-xl rounded-2xl transition-all duration-300 ${
        !noBorder ? "border" : ""
      } ${
        isDark
          ? "bg-slate-900/50 border-slate-800/50 shadow-xl shadow-purple-900/10"
          : "bg-white/40 border-white/40 shadow-xl shadow-indigo-500/5"
      } ${padding ? "p-6" : ""} ${className}`}
    >
      {children}
    </MotionComponent>
  );
};

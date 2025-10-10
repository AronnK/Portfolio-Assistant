"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  delay?: number;
  className?: string;
}

export const SlideIn = ({
  children,
  direction = "bottom",
  delay = 0,
  className,
}: SlideInProps) => {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    top: { x: 0, y: -20 },
    bottom: { x: 0, y: 20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

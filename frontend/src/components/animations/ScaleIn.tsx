"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.6,
  className,
}: ScaleInProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        duration,
        delay,
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

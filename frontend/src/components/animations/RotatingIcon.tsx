"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RotatingIconProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export const RotatingIcon = ({
  children,
  duration = 2,
  className,
}: RotatingIconProps) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

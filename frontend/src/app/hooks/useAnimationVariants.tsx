"use client";
import { Variants } from "framer-motion";

export const useAnimationVariants = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", duration: 0.6 },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardHover: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerContainer,
    cardHover,
  };
};

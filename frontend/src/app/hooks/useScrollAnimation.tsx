"use client";
import { useEffect } from "react";
import { useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = false } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!triggerOnce) {
      controls.start("hidden");
    }
  }, [isInView, controls, triggerOnce]);

  return { ref, controls, isInView };
};

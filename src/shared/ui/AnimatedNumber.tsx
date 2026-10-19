"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  delay?: number;
}

export default function AnimatedNumber({
  value,
  className,
  delay = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 22,
    mass: 1,
  });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const timeout = window.setTimeout(() => motionValue.set(value), delay * 1000);
      return () => window.clearTimeout(timeout);
    }
  }, [inView, value, delay, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
'use client';

import { motion, useScroll, useSpring } from 'framer-motion'; // Ensure you're using framer-motion
import { useRef } from 'react';

const DEFAULT_SPRING_OPTIONS = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
};

export default function ScrollProgress({ className = '', springOptions = {}, containerRef }) {
  const { scrollYProgress } = useScroll({
    container: containerRef,
    layoutEffect: !!(containerRef && containerRef.current),
  });

  const scaleX = useSpring(scrollYProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...springOptions,
  });

  return (
    <motion.div
      className={`inset-x-0 top-0 h-1 origin-left ${className}`}
      style={{
        scaleX,
      }}
    />
  );
}

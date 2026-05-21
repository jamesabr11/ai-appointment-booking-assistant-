"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MouseGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary red glow */}
      <motion.div
        className="absolute h-[100px] w-[100px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(203,53,51,0.15) 0%, rgba(203,53,51,0.05) 40%, transparent 70%)",
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
        transition={{
          type: "tween",
          duration: 0,
        }}
      />
      {/* Secondary blue glow */}
      <motion.div
        className="absolute h-[60px] w-[60px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(24,55,101,0.12) 0%, transparent 60%)",
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
        transition={{
          type: "tween",
          duration: 0,
        }}
      />
    </motion.div>
  );
}

"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback } from "react";
import clsx from "clsx";

export function TiltCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rx = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 200, damping: 12 });
  const ry = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 200, damping: 12 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(Math.max(-50, Math.min(50, e.clientX - r.left - r.width / 2)));
    y.set(Math.max(-50, Math.min(50, e.clientY - r.top - r.height / 2)));
  }, [x, y]);

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={clsx("transition-shadow hover:shadow-xl", className)}
    >
      {children}
    </motion.div>
  );
}

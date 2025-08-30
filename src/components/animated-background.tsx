"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* floating gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full
                   bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_60%)]
                   blur-3xl"
        animate={{ x: [0, 60, -40, 0], y: [0, -20, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full
                   bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.35),transparent_60%)]
                   blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* subtle dotted grid overlay */}
      <div className="absolute inset-0
        bg-[linear-gradient(transparent,transparent),radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_1px)]
        dark:bg-[linear-gradient(transparent,transparent),radial-gradient(circle_at_1px_1px,#27272a_1px,transparent_1px)]
        bg-[size:100%_100%,24px_24px]" />
    </div>
  );
}

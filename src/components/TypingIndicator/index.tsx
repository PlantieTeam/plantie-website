import { motion } from "framer-motion";

export default function TypingIndicator({ status }: { status: string }) {
  const dotVariants = {
    start: { y: "0%" },
    end: { y: "60%" },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 text-zinc-500 text-xs italic tracking-wide"
    >
      <span>{status}</span>
      <div className="flex gap-1 items-center h-2 pt-1">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.12,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
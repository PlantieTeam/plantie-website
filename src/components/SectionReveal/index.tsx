import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  from?: "left" | "right" | "bottom";
  delay?: number;
}

const variants = {
  hiddenLeft: {
    opacity: 0,
    x: -80,
  },
  hiddenRight: {
    opacity: 0,
    x: 80,
  },
  hiddenBottom: {
    opacity: 0,
    y: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
} as const;

const SectionReveal = ({
  children,
  from = "bottom",
  delay = 0,
}: Props) => {
  const hiddenVariant =
    from === "left"
      ? "hiddenLeft"
      : from === "right"
      ? "hiddenRight"
      : "hiddenBottom";

  return (
    <motion.div
      variants={variants}
      initial={hiddenVariant}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
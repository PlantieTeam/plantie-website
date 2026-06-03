import { motion } from "framer-motion";

export default function UserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-2.5 text-white text-sm shadow-md shadow-emerald-950/20 leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
}
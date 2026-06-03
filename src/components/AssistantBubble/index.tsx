import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sources from "../Sources";
import type { Message } from "../../types/chat";
import { motion } from "framer-motion";

export default function AssistantBubble({ message }: { message: Message }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 justify-start"
    >
      {/* Plantie Icon Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-base shadow-md shadow-emerald-900/10 shrink-0 mt-0.5">
        🌱
      </div>

      <div className="max-w-[85%] bg-zinc-900/50 border border-zinc-800/60 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-zinc-200 shadow-sm space-y-3">
        {message.streaming ? (
          <div className="leading-relaxed animate-pulse content-streaming">{message.content}</div>
        ) : (
          <div className="prose prose-invert prose-emerald max-w-none leading-relaxed text-zinc-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {!message.streaming && message.sources && message.sources.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80">
            <Sources sources={message.sources} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
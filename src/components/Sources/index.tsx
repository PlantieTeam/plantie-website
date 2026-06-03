import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Source } from "../../types/chat";

export default function Sources({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);

  if (!sources?.length) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-400 font-medium transition-colors duration-150"
      >
        <span className="text-[10px]">📂</span>
        <span>{sources.length} {sources.length === 1 ? 'source' : 'sources'} verified</span>
        <span className={`text-[9px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-1.5"
          >
            {sources.map((s, i) => (
              <div 
                key={i} 
                className="text-xs bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2.5 text-zinc-400 leading-normal"
              >
                <div className="font-semibold text-zinc-300 mb-0.5 text-[11px] uppercase tracking-wider text-emerald-500/90">
                  {s.source}
                </div>
                <div>{s.content}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
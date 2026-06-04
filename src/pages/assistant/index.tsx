import {  useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import { uid } from "../../utils/uid";
import { cleanMarkdown } from "../../utils/cleanMarkdown";

import type { Message } from "../../types/chat";

import UserBubble from "../../components/UserBubble";
import AssistantBubble from "../../components/AssistantBubble";
import TypingIndicator from "../../components/TypingIndicator";
import EmptyState from "../../components/EmptyState";

import { streamChat } from "../../services/chatApi";

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [status] = useState("Plantie is thinking");


  const buildHistory = useCallback(() => {
    return messages
      .filter((m) => !m.streaming)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));
  }, [messages]);

  const startStream = async (override?: string) => {
    const trimmed = (override ?? query).trim();
    if (!trimmed || loading) return;

    setQuery("");
    setLoading(true);


    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: trimmed,
    };

    setMessages((p) => [...p, userMsg]);

    const assistantId = uid();

    setMessages((p) => [
      ...p,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
      },
    ]);

    try {
      const res = await streamChat({
        query: trimmed,
        history: buildHistory(),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          let event = "token";
          let data = "";

          for (const line of part.split("\n")) {
            if (line.startsWith("event: ")) event = line.slice(7);
            if (line.startsWith("data: ")) data = line.slice(6);
          }

          if (event === "token") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + data }
                  : m
              )
            );
          }

          if (event === "done") {
            const meta = JSON.parse(data);

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: cleanMarkdown(m.content),
                      sources: meta.sources || [],
                      streaming: false,
                    }
                  : m
              )
            );
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased flex flex-col justify-between">
      {/* Scrollable Conversation Container */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-24 pb-36 flex-1 space-y-6">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={startStream} />
        ) : (
          <>
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((m) =>
                  m.role === "user" ? (
                    <UserBubble key={m.id} content={m.content} />
                  ) : (
                    <AssistantBubble key={m.id} message={m} />
                  )
                )}
              </AnimatePresence>
            </div>

            {loading && (
              <div className="pl-12">
                <TypingIndicator status={status} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky Bottom Input Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto relative flex items-center bg-zinc-900/90 border border-zinc-800 focus-within:border-emerald-500/50 rounded-2xl p-1.5 shadow-xl backdrop-blur-md transition-all duration-250">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startStream()}
            placeholder="Ask anything about your crops or plants..."
            className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />

          <button
            onClick={() => startStream()}
            disabled={!query.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-emerald-600 disabled:scale-100 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-150"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
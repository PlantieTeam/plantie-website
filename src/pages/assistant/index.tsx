import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Source {
  source: string;
  content: string;
  similarity?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  sources?: Source[];
  streaming?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const toolMeta: Record<string, { emoji: string; label: string }> = {
  rag_tool: { emoji: "🔍", label: "Knowledge base" },
  weather_tool: { emoji: "🌤️", label: "Weather" },
  fertilizer_tool: { emoji: "🌱", label: "Fertilizer calc" },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Clean malformed markdown from LLM output ───────────────────────────────────
function cleanMarkdown(text: string): string {
  return text
    .replace(/([^\n])(#{1,3} )/g, "$1\n\n$2")
    .replace(/\n(#{1,3} )/g, "\n\n$1")
    .replace(/([^\n])([\u2714\u2705\u274C\u{1F33F}-\u{1F399}])/gu, "$1\n$2")
    .replace(/([^\n])(- |\* )/g, "$1\n$2")
    .replace(/([^\n])(\d+\. )/g, "$1\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Markdown components ────────────────────────────────────────────────────────
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-2xl font-bold text-transparent">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-7 text-xl font-semibold text-white">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-lg font-semibold text-emerald-300">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mb-4 leading-7 text-white/85">{children}</p>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-5 text-white/85">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-white/85">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="leading-7">{children}</li>,

  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="italic text-white/70">{children}</em>
  ),

  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");

    return isBlock ? (
      <code className="block text-sm text-emerald-200">{children}</code>
    ) : (
      <code className="rounded-lg bg-emerald-500/10 px-1.5 py-0.5 text-sm font-mono text-emerald-300">
        {children}
      </code>
    );
  },

  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm backdrop-blur-md">
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-emerald-500 pl-4 italic text-white/60">
      {children}
    </blockquote>
  ),

  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-white/10">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="border border-white/10 px-3 py-2 text-left font-semibold text-white">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border border-white/10 px-3 py-2 text-white/75">
      {children}
    </td>
  ),

  hr: () => <hr className="my-6 border-white/10" />,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-emerald-400 underline underline-offset-2 transition hover:text-emerald-300"
    >
      {children}
    </a>
  ),
};

// ── User bubble ────────────────────────────────────────────────────────────────
function UserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end"
    >
      <div className="max-w-[78%] rounded-3xl rounded-br-md border border-emerald-400/20 bg-gradient-to-br from-emerald-500/25 to-emerald-700/20 px-5 py-3 text-sm leading-7 text-white shadow-lg shadow-emerald-900/20 backdrop-blur-md">
        {content}
      </div>
    </motion.div>
  );
}

// ── Tool badges ────────────────────────────────────────────────────────────────
function ToolBadges({ tools }: { tools: string[] }) {
  if (!tools.length) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tools.map((tool) => {
        const meta = toolMeta[tool] ?? { emoji: "⚡", label: tool };

        return (
          <motion.span
            key={tool}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-3 py-1 text-xs text-emerald-200 shadow-sm backdrop-blur-md"
          >
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
          </motion.span>
        );
      })}
    </div>
  );
}

// ── Sources ────────────────────────────────────────────────────────────────────
function Sources({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/70"
      >
        <span>
          📄 {sources.length} source{sources.length > 1 ? "s" : ""}
        </span>

        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-2">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <span>📄 {src.source}</span>

                    {src.similarity !== undefined && (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                        {(src.similarity * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>

                  <div className="text-xs leading-6 text-white/50">
                    {src.content}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Assistant bubble ───────────────────────────────────────────────────────────
function AssistantBubble({ message }: { message: Message }) {
  const { content, tools = [], sources = [], streaming } = message;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-white/10 bg-gradient-to-br from-[#21113d]/95 to-[#12071f]/95 px-5 py-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <ToolBadges tools={tools} />

        {streaming ? (
          <div className="whitespace-pre-wrap text-sm leading-7 text-white/90">
            {content}

            <span className="ml-1 inline-block h-4 w-0.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
          </div>
        ) : (
          <div className="text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {!streaming && <Sources sources={sources} />}
      </div>
    </motion.div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator({ status }: { status: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-3 rounded-3xl rounded-bl-md border border-white/10 bg-gradient-to-r from-[#1d1036]/95 to-[#12071f]/95 px-5 py-4 shadow-lg backdrop-blur-xl">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        <span className="text-xs tracking-wide text-white/50">
          {status}
        </span>
      </div>
    </motion.div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const suggestions = [
    "What causes yellow leaves in tomatoes?",
    "Best irrigation schedule for wheat in dry season?",
    "How much urea for 2 acres NPK 120-60-40?",
    "How do I treat powdery mildew on cucumbers?",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 text-6xl shadow-2xl shadow-emerald-900/30 backdrop-blur-md">
        🌿
      </div>

      <h2 className="mb-2 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent">
        Ask Plantie anything
      </h2>

      <p className="mb-10 max-w-md text-sm leading-7 text-white/45">
        Agricultural AI assistant — crops, diseases, fertilizers &amp; more
      </p>

      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-xs leading-6 text-white/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-cyan-500/5 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const AssistantPage = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef("session-" + uid());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildHistory = useCallback(() => {
    return messages
      .filter((m) => !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }));
  }, [messages]);

  const startStream = async (overrideQuery?: string) => {
    const trimmed = (overrideQuery ?? query).trim();

    if (!trimmed || loading) return;

    setQuery("");
    setLoading(true);
    setStatus("Connecting...");

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);

    const assistantId = uid();

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        tools: [],
        sources: [],
        streaming: true,
      },
    ]);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          query: trimmed,
          session_id: sessionId.current,
          user_id: "320f3bc1-91a1-4d3d-9522-7a82514077f6",
          location: { latitude: 31.9, longitude: 35.2 },
          history: buildHistory(),
          top_k: 5,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      setStatus("AI thinking...");

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");

        buffer = parts.pop() ?? "";

        for (const part of parts) {
          let eventType = "token";
          let data = "";

          for (const line of part.split("\n")) {
            if (line.startsWith("event: "))
              eventType = line.slice(7).trim();
            else if (line.startsWith("data: "))
              data = line.slice(6);
          }

          switch (eventType) {
            case "tool":
              setStatus(`Using ${toolMeta[data]?.label ?? data}...`);

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        tools: m.tools?.includes(data)
                          ? m.tools
                          : [...(m.tools ?? []), data],
                      }
                    : m
                )
              );

              break;

            case "token":
              setStatus("Generating...");

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data }
                    : m
                )
              );

              break;

            case "done":
              try {
                const meta = JSON.parse(data);

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: cleanMarkdown(m.content),
                          sources: meta.sources ?? [],
                          streaming: false,
                        }
                      : m
                  )
                );
              } catch {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: cleanMarkdown(m.content),
                          streaming: false,
                        }
                      : m
                  )
                );
              }

              setStatus("Ready");

              break;

            case "error":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: `⚠️ Error: ${data}`,
                        streaming: false,
                      }
                    : m
                )
              );

              setStatus("Error");

              break;
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: `⚠️ Connection error: ${err.message}`,
                streaming: false,
              }
            : m
        )
      );

      setStatus("Error");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStatus("Ready");
    sessionId.current = "session-" + uid();
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#090414] pt-24 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_right,rgba(139,92,246,0.15),transparent_30%)]" />

      {/* Glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-0 top-[40%] h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto flex h-[calc(100dvh-110px)] w-full max-w-5xl flex-col px-4 pb-6 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center justify-between"
        >
          <div>
            <h1 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Plantie AI
            </h1>

            <p className="mt-1 text-xs tracking-wide text-white/40">
              Agricultural assistant
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-white/50 backdrop-blur-md transition-all hover:border-emerald-400/20 hover:bg-emerald-500/10 hover:text-white"
            >
              Clear chat
            </button>
          )}
        </motion.div>

        {/* Chat window */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_10px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 ? (
              <EmptyState onSuggestion={(s) => startStream(s)} />
            ) : (
              <div className="flex flex-col gap-5">
                <AnimatePresence initial={false}>
                  {messages.map((msg) =>
                    msg.role === "user" ? (
                      <UserBubble
                        key={msg.id}
                        content={msg.content}
                      />
                    ) : (
                      <AssistantBubble
                        key={msg.id}
                        message={msg}
                      />
                    )
                  )}
                </AnimatePresence>

                {loading &&
                  messages[messages.length - 1]?.content === "" && (
                    <TypingIndicator status={status} />
                  )}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-[#0b0618]/80 px-4 py-4 backdrop-blur-2xl sm:px-5">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  startStream()
                }
                placeholder="Ask about crops, diseases, fertilizers..."
                disabled={loading}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white shadow-inner backdrop-blur-md placeholder:text-white/30 outline-none transition-all focus:border-emerald-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] disabled:opacity-50"
              />

              <button
                onClick={() => startStream()}
                disabled={loading || !query.trim()}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>

                    Wait
                  </span>
                ) : (
                  "Send"
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-white/30">
                {status}
              </span>

              <span className="text-[11px] text-white/20">
                {
                  messages.filter((m) => m.role === "user")
                    .length
                }{" "}
                messages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE_URL = "http://127.0.0.1:8000";

const AssistantPage = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [tools, setTools] = useState<string[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = useRef(
    "session-" + Math.random().toString(36).slice(2, 8)
  );

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [answer]);

  // CLEAN MARKDOWN
  const cleanMarkdown = (text: string) => {
    return text
      // Fix heading spacing
      .replace(/(#+)([^\s#])/g, "$1 $2")

      // Ensure headings start on new lines
      .replace(/([^\n])\n?(#+\s)/g, "$1\n\n$2")

      // Add spacing before numbered sections
      .replace(/([a-z])(\d+\.)/g, "$1\n\n$2")

      // Fix broken markdown tables
      .replace(/\|\-\-/g, "\n|--")

      // Prevent merged paragraphs
      .replace(/([a-z])([A-Z])/g, "$1\n\n$2")

      // Reduce excessive newlines
      .replace(/\n{3,}/g, "\n\n")

      .trim();
  };

  // TOOL EMOJIS
  const toolEmoji = (tool: string) => {
    return (
      {
        rag_tool: "🔍",
        weather_tool: "🌤️",
        fertilizer_tool: "🌱",
      }[tool] || "⚡"
    );
  };

  // STREAM
  const startStream = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    setTools([]);
    setSources([]);
    setIsFinished(false);
    setStatus("Connecting...");

    let rawAnswer = "";

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            session_id: sessionId.current,
            user_id:
              "320f3bc1-91a1-4d3d-9522-7a82514077f6",
            location: {
              latitude: 31.9,
              longitude: 35.2,
            },
            history: [],
            top_k: 5,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const reader = response.body?.getReader();

      if (!reader) return;

      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      setStatus("AI thinking...");

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const parts = buffer.split("\n\n");

        buffer = parts.pop() || "";

        for (const part of parts) {
          let currentEvent = "token";
          let data = "";

          for (const line of part.split("\n")) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              data = line.slice(6);
            }
          }

          switch (currentEvent) {
            case "tool":
              setTools((prev) =>
                prev.includes(data)
                  ? prev
                  : [...prev, data]
              );

              setStatus(`Using ${data}`);
              break;

            case "token":
              rawAnswer += data;

              setAnswer(cleanMarkdown(rawAnswer));

              setStatus("Generating answer...");
              break;

            case "done":
              try {
                const meta = JSON.parse(data);

                setSources(meta.sources || []);
              } catch (e) {
                console.log(e);
              }

              setIsFinished(true);
              setStatus("Done");

              break;

            case "error":
              setStatus(data);
              break;
          }
        }
      }
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#23075B] via-[#1B0545] to-[#14032F] pt-24 text-white">

      {/* BG GLOW */}
      <div className="absolute left-1/2 top-32 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#47B88A]/20 blur-3xl" />

      <div className="absolute right-0 top-[40%] h-[300px] w-[300px] rounded-full bg-[#7C3AED]/20 blur-3xl" />

      {/* CONTAINER */}
      <div className="relative mx-auto flex h-[calc(100dvh-110px)] w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-6 sm:px-6 lg:px-8">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-xl">
            🌱 AI Farming Assistant
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Ask Plantie Anything
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Get AI-powered agricultural guidance,
            disease diagnosis, fertilizer planning,
            irrigation advice, weather insights, and more.
          </p>
        </motion.div>

        {/* CHAT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl"
        >

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8">

            {/* TOOL BADGES */}
            <AnimatePresence>
              {tools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 flex flex-wrap gap-3"
                >
                  {tools.map((tool) => (
                    <div
                      key={tool}
                      className="rounded-full border border-[#47B88A]/20 bg-[#47B88A]/10 px-4 py-2 text-sm text-[#9EF0CB]"
                    >
                      {toolEmoji(tool)} {tool}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ANSWER */}
            {answer ? (
              isFinished ? (
                <div className="prose prose-invert prose-headings:scroll-mt-24 max-w-none">

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-6 mt-10 text-4xl font-bold text-white">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="mb-5 mt-10 text-3xl font-semibold text-white">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="mb-4 mt-8 text-2xl font-semibold text-[#9EF0CB]">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-5 leading-8 text-white/90">
                          {children}
                        </p>
                      ),

                      ul: ({ children }) => (
                        <ul className="mb-6 list-disc space-y-3 pl-6 text-white/90">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="mb-6 list-decimal space-y-3 pl-6 text-white/90">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="leading-8">
                          {children}
                        </li>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),

                      code: ({ children }) => (
                        <code className="rounded-lg bg-white/10 px-2 py-1 text-sm text-[#9EF0CB]">
                          {children}
                        </code>
                      ),

                      pre: ({ children }) => (
                        <pre className="mb-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5">
                          {children}
                        </pre>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="my-6 border-l-4 border-[#47B88A] pl-4 italic text-white/70">
                          {children}
                        </blockquote>
                      ),

                      table: ({ children }) => (
                        <div className="mb-6 overflow-x-auto rounded-2xl border border-white/10">
                          <table className="w-full border-collapse">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-white/10">
                          {children}
                        </thead>
                      ),

                      th: ({ children }) => (
                        <th className="border border-white/10 px-4 py-3 text-left text-white">
                          {children}
                        </th>
                      ),

                      td: ({ children }) => (
                        <td className="border border-white/10 px-4 py-3 text-white/80">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-8 text-white/90">
                  {answer}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-white/40">
                <div className="mb-4 text-5xl">
                  🌱
                </div>

                <div className="text-lg">
                  Your AI farming assistant is ready.
                </div>
              </div>
            )}

            {/* SOURCES */}
            {sources.length > 0 && (
              <div className="mt-12 border-t border-white/10 pt-8">

                <h3 className="mb-5 text-xl font-semibold text-white">
                  Sources
                </h3>

                <div className="flex flex-col gap-4">
                  {sources.map((src, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="mb-3 font-medium text-[#9EF0CB]">
                        📄 {src.source}
                      </div>

                      <div className="text-sm leading-7 text-white/70">
                        {src.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="sticky bottom-0 border-t border-white/10 bg-[#12082e]/90 p-4 backdrop-blur-2xl sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row">

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && startStream()
                }
                placeholder="Ask about crops, diseases, fertilizers..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#47B88A]/40 focus:bg-white/15"
              />

              <button
                disabled={loading}
                onClick={startStream}
                className="rounded-2xl bg-[#47B88A] px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#56c899] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Ask AI"}
              </button>
            </div>

            {/* STATUS */}
            <div className="mt-4 text-sm text-white/40">
              {status}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssistantPage;
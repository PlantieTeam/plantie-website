import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const AssistantPage = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [tools, setTools] = useState<string[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = useRef(
    "session-" + Math.random().toString(36).slice(2, 8)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [answer]);

  const renderMarkdown = (md: string) => {
    let html = md;

    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, lang, code) =>
        `<pre><code class="language-${lang}">${code.trimEnd()}</code></pre>`
    );

    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    html = html.replace(
      /^(?!<(h[1-6]|ul|ol|li|pre|blockquote|hr))(.+)$/gm,
      "<p>$2</p>"
    );

    return html;
  };

  const toolEmoji = (tool: string) => {
    return (
      {
        rag_tool: "🔍",
        weather_tool: "🌤️",
        fertilizer_tool: "🌱",
      }[tool] || "⚡"
    );
  };

  const startStream = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    setTools([]);
    setSources([]);
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
              setAnswer(renderMarkdown(rawAnswer));
              setStatus("Generating answer...");
              break;

            case "done":
              try {
                const meta = JSON.parse(data);

                setSources(meta.sources || []);
                setStatus("Done");
              } catch (e) {
                console.log(e);
              }
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
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#23075B] to-[#14032F] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8">

      {/* BACKGROUND GLOW */}
      <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#47B88A]/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-xl">
            🌱 AI Farming Assistant
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Ask Plantie Anything
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Get AI-powered agricultural guidance,
            disease diagnosis, fertilizer help,
            weather insights, and more.
          </p>
        </motion.div>

        {/* CHAT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl"
        >
          {/* CHAT BODY */}
          <div className="min-h-[450px] p-5 sm:p-8">

            {/* TOOLS */}
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
            <div
              className={`prose prose-invert max-w-none text-white ${
                loading ? "animate-pulse" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html:
                  answer ||
                  `
                  <div class="text-center py-20 text-white/40">
                    🌱 Your AI farming assistant is ready.
                  </div>
                  `,
              }}
            />

            <div ref={messagesEndRef} />

            {/* SOURCES */}
            {sources.length > 0 && (
              <div className="mt-10 border-t border-white/10 pt-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Sources
                </h3>

                <div className="flex flex-col gap-3">
                  {sources.map((src, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 font-medium text-[#9EF0CB]">
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
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 bg-black/10 p-4 sm:p-6">
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
                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#47B88A]/40 focus:bg-white/15"
              />

              <button
                disabled={loading}
                onClick={startStream}
                className="rounded-2xl bg-[#47B88A] px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#56c899] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Ask AI"}
              </button>
            </div>

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
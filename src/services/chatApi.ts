const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function streamChat(payload: {
  query: string;

  history: { role: string; content: string }[];
}) {
  const res = await fetch(`${BASE_URL}/api/v1/chat/stream-temp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: payload.query,
      history: payload.history,
      top_k: 5,
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res;
}
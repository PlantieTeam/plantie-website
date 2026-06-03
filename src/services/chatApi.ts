const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function createChatSession(userId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/chat/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId , is_temporal:true}),
  });

  if (!res.ok) throw new Error("Failed to create session");

  const data = await res.json();

  return data.session_id || data.sessionId || data.id;
}

export async function streamChat(payload: {
  query: string;
  sessionId: string;
  userId: string;
  history: { role: string; content: string }[];
}) {
  const res = await fetch(`${BASE_URL}/api/v1/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: payload.query,
      session_id: payload.sessionId,
      user_id: payload.userId,
      history: payload.history,
      top_k: 5,
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res;
}
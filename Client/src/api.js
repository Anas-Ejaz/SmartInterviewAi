const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000" || "http://smart-interview-ai-backend.vercel.app";
const TIMEOUT_MS = 90000;

export async function api(path, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API}/api${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("The backend took too long to respond. Try again, and check the backend terminal for errors.");
    }
    throw new Error("Cannot reach the backend. Start it with: uvicorn main:app --reload --port 8000");
  } finally {
    clearTimeout(timer);
  }

  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new Error(
      res.ok
        ? "Got a web page instead of JSON from /api, so the frontend is not reaching the backend. Set VITE_API_URL or add a Vite proxy for /api."
        : `Backend request failed (${res.status}). Is the backend running on port 8000?`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data.detail;
    throw new Error(typeof d === "string" ? d : "Request failed. Check your inputs and try again.");
  }
  return data;
}
const API = import.meta.env.VITE_API_URL || "";

export async function api(path, body) {
  let res;
  try {
    res = await fetch(`${API}/api${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the backend. Start it with: uvicorn main:app --reload --port 8000");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data.detail;
    throw new Error(typeof d === "string" ? d : "Request failed. Check your inputs and try again.");
  }
  return data;
}

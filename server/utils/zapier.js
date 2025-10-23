import fetch from "node-fetch";

export async function sendToZapier(payload) {
  const url = process.env.ZAPIER_CATCH_HOOK_URL;
  if (!url) return { ok: false, error: "No Zapier hook URL configured" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

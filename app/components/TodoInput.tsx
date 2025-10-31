"use client";

import { useState } from "react";

export default function TodoInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setOk(false);
    setError(null);
    const value = text.trim();
    if (!value) return;
    try {
      setLoading(true);
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create item");
      }
      setOk(true);
      setText("");
      // Optionally log the created item for quick verification
      try {
        const json = await res.json();
        // eslint-disable-next-line no-console
        console.log("Created todo:", json);
      } catch {}
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your item…"
        className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        onClick={() => onSubmit()}
        disabled={loading || !text.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send"}
      </button>
      {error && <span className="ml-2 text-sm text-red-600">{error}</span>}
      {ok && !error && <span className="ml-2 text-sm text-green-600">Saved</span>}
    </form>
  );
}

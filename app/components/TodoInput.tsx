"use client";

import { useEffect, useMemo, useState } from "react";

interface TodoItem {
  id: number | string;
  item: string;
  created_by?: string;
  created_at?: string;
}

export default function TodoInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [items, setItems] = useState<TodoItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // Local editable copy of text for each item id
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const hasItems = useMemo(() => items && items.length > 0, [items]);

  const loadItems = async () => {
    try {
      setItemsError(null);
      setItemsLoading(true);
      const res = await fetch("/api/todos", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch items");
      }
      const list: TodoItem[] = Array.isArray(json?.items) ? json.items : [];
      setItems(list);
      // seed drafts
      const nextDrafts: Record<string, string> = {};
      for (const it of list) {
        nextDrafts[String(it.id)] = it.item ?? "";
      }
      setDrafts(nextDrafts);
    } catch (e: any) {
      setItemsError(e?.message || "Failed to load items");
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

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
      // Reload list after creating
      await loadItems();
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (id: number | string) => {
    const key = String(id);
    const value = (drafts[key] ?? "").trim();
    if (!value) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save");
      }
      await loadItems();
    } catch (e: any) {
      setItemsError(e?.message || "Failed to save");
    }
  };

  const onDelete = async (id: number | string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to delete");
      }
      await loadItems();
    } catch (e: any) {
      setItemsError(e?.message || "Failed to delete");
    }
  };

  return (
    <div className="w-full grid gap-4">
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

      <div className="w-full grid gap-2">
        <div className="text-sm text-gray-600">Your items</div>
        {itemsError && (
          <div className="text-sm text-red-600">{itemsError}</div>
        )}
        {itemsLoading && (
          <div className="text-sm text-gray-500">Loading…</div>
        )}
        {!itemsLoading && !hasItems && (
          <div className="text-sm text-gray-500">No items yet.</div>
        )}
        {hasItems && (
          <div className="grid gap-2">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-2">
                <div className="w-16 text-xs text-gray-500">#{String(it.id)}</div>
                <input
                  type="text"
                  value={drafts[String(it.id)] ?? it.item ?? ""}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [String(it.id)]: e.target.value }))
                  }
                  className="flex-1 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => onSave(it.id)}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500 active:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(it.id)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-500 active:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

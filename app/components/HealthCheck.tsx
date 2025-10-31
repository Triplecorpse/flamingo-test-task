'use client';

import { useEffect, useState } from 'react';

export default function HealthCheck() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [details, setDetails] = useState<any>(null);

  const run = async () => {
    try {
      setStatus('loading');
      const res = await fetch('/api/health', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setStatus('ok');
      } else {
        setStatus('error');
      }
      setDetails(json);
    } catch (e: any) {
      setStatus('error');
      setDetails({ error: e?.message || 'Unknown error' });
    }
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Supabase Health</h2>
          <p className="text-sm text-gray-600">Checks environment and connectivity via /api/health</p>
        </div>
        <button
          onClick={run}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Checking…' : 'Re-run'}
        </button>
      </div>

      <div className="mt-4 rounded-md border bg-white p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === 'ok' ? 'bg-green-500' : status === 'loading' ? 'bg-amber-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
          <span className="font-medium">Status:</span>
          <span>{status.toUpperCase()}</span>
        </div>
        <pre className="mt-3 overflow-auto rounded bg-gray-100 p-2 text-xs leading-relaxed">{JSON.stringify(details, null, 2)}</pre>
      </div>
    </div>
  );
}

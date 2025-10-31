'use client';

import { useEffect, useState } from 'react';

interface AuthResult {
  authenticated: boolean;
  user?: any;
  error?: string;
}

export default function AuthCheck() {
  const [auth, setAuth] = useState<AuthResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
        });
        const data: AuthResult = await res.json();
        if (!cancelled) {
          setAuth(data);
          try {
            sessionStorage.setItem('authStatus', JSON.stringify(data));
          } catch {}
        }
      } catch (e) {
        if (!cancelled) {
          setAuth({ authenticated: false, error: 'Failed to check auth' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>email: {auth?.user?.email ?? "N/A"}</div>
  );
}

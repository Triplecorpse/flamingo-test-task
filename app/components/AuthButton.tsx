'use client';

import { getGoogleIdToken } from "../../lib/google/googleToken";

export default function AuthButton() {
  async function signInWithGoogle() {
    const token = await getGoogleIdToken();
    await fetch('/api/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={signInWithGoogle}
        aria-label="Sign in with Google"
        className="inline-flex items-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-5 w-5"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="#FFC107" d="M43.611 20.083h-1.611v-.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.053 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/>
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.813C14.47 16.042 18.88 14 24 14c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.053 6.053 29.268 4 24 4 16.318 4 9.716 8.337 6.306 14.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.196-5.238C29.046 35.488 26.637 36 24 36c-5.189 0-9.594-3.315-11.251-7.946l-6.553 5.046C9.558 39.556 16.248 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083h-1.611v-.083H24v8h11.303c-.79 2.233-2.229 4.156-4.094 5.585l.003-.002 6.196 5.238C39.084 35.977 44 30.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
        </svg>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

'use client';

import {getGoogleIdToken} from "../../lib/google/googleToken";

export default function AuthButtons() {
    async function signInWithGoogle() {
        const token = await getGoogleIdToken();
        await fetch('/api/google', { method: "POST", body: JSON.stringify({ token: token }) });
    }

    return (
        <div className="flex gap-2">
            <button onClick={signInWithGoogle} className="rounded bg-black text-white px-3 py-1.5 hover:opacity-90">
                Continue with Google
            </button>
        </div>
    );
}

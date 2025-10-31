'use client';

import {getGoogleIdToken} from "../../lib/google/googleToken";

export default function AuthButton() {
    async function signInWithGoogle() {
        const token = await getGoogleIdToken();
        await fetch('/api/google', { method: "POST", body: JSON.stringify({ token: token }) });
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={signInWithGoogle}
                className="bg-red-500 text-white p-4"
            >
                Sign in with Google
            </button>
        </div>
    );
}

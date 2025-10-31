"use client";

import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function GoogleRedirectClient({token}: { token?: string | null }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFromClient = searchParams.get('code');
    const effectiveToken = tokenFromClient ?? token ?? null;

    useEffect(() => {
        async function handleToken(t?: string | null) {
            if (!t) return;
            try {
                localStorage.setItem("googleToken", t);
                const res = await fetch("/api/google", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({code: t}),
                });
                try {
                    const data = await res.json();
                    console.log("/api/google response:", data);
                } catch {}
            } catch (e) {
                console.error("Failed to process Google token:", e);
            } finally {
                router.replace("/");
            }
        }

        handleToken(effectiveToken);
    }, [effectiveToken, router]);

    return null;
}

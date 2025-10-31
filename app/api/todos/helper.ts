import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export function sanitizeItem(input: unknown, maxLen = 500): string | null {
    if (typeof input !== 'string') return null;
    let s = input.trim();
    s = s.replace(/<[^>]*>/g, '');
    s = s.replace(/\s+/g, ' ');
    if (s.length > maxLen) s = s.slice(0, maxLen);
    s = s.replace(/[\u0000-\u001F\u007F]/g, '');
    if (!s) return null;
    return s;
}

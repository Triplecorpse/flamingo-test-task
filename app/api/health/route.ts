import { NextResponse } from 'next/server';
import supabaseServer from '../../../lib/supabase/server';

export async function GET() {
  const hasServerEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ) && Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase.auth.getSession();
    return NextResponse.json({
      ok: !error,
      hasServerEnv,
      supabaseAuthReachable: !error,
      session: data?.session ?? null,
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, hasServerEnv, error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}

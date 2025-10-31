import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyGoogleToken } from '../../services/oauth.server';
import supabaseServer from '../../../lib/supabase/server';

function sanitizeItem(input: unknown, maxLen = 500): string | null {
  if (typeof input !== 'string') return null;
  let s = input.trim();
  // strip HTML tags
  s = s.replace(/<[^>]*>/g, '');
  // collapse whitespace
  s = s.replace(/\s+/g, ' ');
  // cap length
  if (s.length > maxLen) s = s.slice(0, maxLen);
  // remove dangerous control chars
  s = s.replace(/[\u0000-\u001F\u007F]/g, '');
  if (!s) return null;
  return s;
}

async function getAuthEmail(): Promise<string | null> {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) return null;
  try {
    const user = await verifyGoogleToken(token);
    const email = user?.email as string | undefined;
    return email ?? null;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  const email = await getAuthEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('created_by', email)
    .order('id', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch todos', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const started = Date.now();
  const rid = Math.random().toString(36).slice(2, 8);
  const log = (...args: any[]) => console.log(`[todos:create][${rid}]`, ...args);

  function preview(val: unknown, max = 60) {
    if (typeof val !== 'string') return undefined;
    const clean = val.replace(/\s+/g, ' ').slice(0, max);
    return clean + (val.length > max ? '…' : '');
  }

  log('start', { ts: new Date().toISOString() });

  const email = await getAuthEmail();
  if (!email) {
    log('unauthorized', { ms: Date.now() - started });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  log('auth.ok', { email });

  let body: any;
  try {
    body = await request.json();
    log('body.received', {
      itemLen: typeof body?.item === 'string' ? body.item.length : undefined,
      itemPreview: preview(body?.item),
    });
  } catch (e: any) {
    log('body.invalid', { error: e?.message, ms: Date.now() - started });
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sanitized = sanitizeItem(body?.item);
  if (!sanitized) {
    log('sanitize.invalid', { ms: Date.now() - started });
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
  }
  log('sanitize.ok', {
    sanitizedLen: sanitized.length,
    changed: typeof body?.item === 'string' ? body.item !== sanitized : undefined,
    sanitizedPreview: preview(sanitized),
  });

  const supabase = supabaseServer();
  log('db.insert.start');
  const { data, error } = await supabase
    .from('todos')
    .insert({ created_by: email, item: sanitized })
    .select('*')
    .single();

  if (error) {
    log('db.insert.error', { error: error.message, ms: Date.now() - started });
    return NextResponse.json({ error: 'Failed to create todo', details: error.message }, { status: 500 });
  }

  log('success', { id: (data as any)?.id, ms: Date.now() - started });
  return NextResponse.json({ item: data }, { status: 201 });
}

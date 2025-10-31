import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyGoogleToken } from '../../../services/oauth.server';
import supabaseServer from '../../../../lib/supabase/server';

function sanitizeItem(input: unknown, maxLen = 500): string | null {
  if (typeof input !== 'string') return null;
  let s = input.trim();
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/\s+/g, ' ');
  if (s.length > maxLen) s = s.slice(0, maxLen);
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = await getAuthEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const idParam = (await params).id;
  const idNum = Number(idParam);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sanitized = sanitizeItem(body?.item);
  if (!sanitized) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('todos')
    .update({ item: sanitized })
    .eq('id', idNum)
    .eq('created_by', email)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update todo', details: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ item: data }, { status: 200 });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = await getAuthEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const idParam = (await params).id;
  const idNum = Number(idParam);

    console.log(idNum);

    const supabase = supabaseServer();
  const { error, count } = await supabase
    .from('todos')
    .delete({ count: 'exact' })
    .eq('id', idNum)
    .eq('created_by', email);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete todo', details: error.message }, { status: 500 });
  }
  if (!count) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

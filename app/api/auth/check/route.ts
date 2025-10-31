import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyGoogleToken } from '../../../services/oauth.server';

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      const user = await verifyGoogleToken(token);
      if (!user?.email) {
        throw new Error('Invalid user data');
      }
      return NextResponse.json({ authenticated: true, user }, { status: 200 });
    } catch (e) {
      // Invalid/expired token – clear cookie and return unauthenticated
      const res = NextResponse.json({ authenticated: false }, { status: 200 });
      res.cookies.set({ name: 'accessToken', value: '', path: '/', maxAge: 0 });
      return res;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ authenticated: false, error: 'Auth check failed' }, { status: 200 });
  }
}

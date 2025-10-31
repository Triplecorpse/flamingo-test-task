import {NextRequest, NextResponse} from 'next/server';
import {getGoogleIdToken, verifyGoogleToken} from "../../services/oauth.server";

export async function POST(request: NextRequest) {
    try {
        let {token, code} = await request.json();

        console.log(code);

        if (code) {
            token = await getGoogleIdToken(code);
        }
        
        const userInfo = await verifyGoogleToken(token);

        if (!userInfo?.email) {
            return NextResponse.json({error: 'Invalid user data'}, {status: 400});
        }


        const response = NextResponse.json({ message: 'Authentication successful', user: userInfo }, { status: 200 });
        response.cookies.set({
            name: 'accessToken',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // 1 hour
        });
        return response;
    } catch (error) {
        console.error('Google token verification failed:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}

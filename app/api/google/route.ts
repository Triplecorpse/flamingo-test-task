import { NextResponse, NextRequest } from 'next/server';
import {verifyGoogleToken} from "../../services/oauth.server";

export async function POST(request: NextRequest) {
    try {
        const {token} = await request.json();
        const userInfo = await verifyGoogleToken(token);
        console.log(userInfo);
        return NextResponse.json({message: 'Authentication successful', user: userInfo}, {status: 200});
    } catch (error) {
        console.error('Google token verification failed:', error);
        return NextResponse.json({error: 'Authentication failed'}, {status: 401});
    }
}

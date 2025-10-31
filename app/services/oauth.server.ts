import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function verifyGoogleToken(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
}

export async function getGoogleIdToken(code: string) {
    try {
        const {tokens} = await client.getToken(code);

        return tokens.id_token;
    } catch (error) {
        console.error('Error getting Google ID token:', error);
        throw error;
    }
}

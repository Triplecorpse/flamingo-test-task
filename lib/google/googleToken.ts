declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    cancel: () => void;
                    prompt: (a: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    onPromptNotification?: (notification: any) => void;
                };
            };
        };
    }
}

interface GoogleNotification {
    getDismissedReason: () => string | null;
    getMomentType: () => "display" | "skipped" | "dismissed";
    getNotDisplayedReason: () =>
        | "browser_not_supported"
        | "suppressed_by_user"
        | "unregistered_origin"; // | "other";
    getSkippedReason: () => string | null;
    isDismissedMoment: () => any;
    isDisplayMoment: () => any;
    isDisplayed: () => any;
    isNotDisplayed: () => any;
    isSkippedMoment: () => any;
}

export const getGoogleIdToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check if Google Identity Services is loaded
        if (!window.google?.accounts?.id) {
            reject(new Error("Google Identity Services not loaded"));
            return;
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        console.log(clientId);

        if (!clientId) {
            reject(
                new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable"),
            );
            return;
        }

        window.google.accounts.id.cancel();

        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: { credential: string }) => {
                console.log("response", response);
                resolve(response.credential);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        // Prompt for Google Sign-In
        window.google.accounts.id.prompt((notification: GoogleNotification) => {
            if (!notification) {
                reject(new Error("Google Sign-In notification is null"));
                return;
            }
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                reject(
                    new Error(
                        "Google One Tap not available: " +
                        notification.getNotDisplayedReason(),
                    ),
                );
            }

            // Check if user suppressed the prompt and redirect to classic OAuth
            if (notification.getNotDisplayedReason() === "suppressed_by_user") {
                const redirectUri = `${window.location.origin}/social/google/redirect`;
                const scope = "email profile";
                const responseType = "id_token";

                const classicOAuthUrl =
                    `https://accounts.google.com/o/oauth2/v2/auth?` +
                    `client_id=${encodeURIComponent(clientId)}&` +
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `scope=${encodeURIComponent(scope)}&` +
                    `response_type=${responseType}&` +
                    `access_type=offline&` +
                    `prompt=consent`;

                window.location.href = classicOAuthUrl;
                return;
            }
        });
    });
};

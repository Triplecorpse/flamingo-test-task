import { Suspense } from "react";
import GoogleRedirectClient from "./GoogleRedirectClient";

export default function GoogleRedirect() {
    return (
        <Suspense fallback={null}>
            <GoogleRedirectClient />
        </Suspense>
    );
}

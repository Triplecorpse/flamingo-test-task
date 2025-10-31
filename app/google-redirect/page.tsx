'use client';

import {useEffect} from "react";
import {useSearchParams, useRouter} from "next/navigation";

export default function GoogleRedirect() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    useEffect(() => {
        if (token) {
            // I know it is not safe. On production, an endpoint should give a cookie response (access and refresh tokens) and afterward we can redirect
            localStorage.setItem('googleToken', token);
            fetch('/api/google', {method: "POST", body: JSON.stringify({token: token})}).then(res => {
                console.log(res.json());
                // router.push('/');
            });
        }
    }, [token])
    return <></>
}

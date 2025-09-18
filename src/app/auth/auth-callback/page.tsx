"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const AuthCallbackPage = () => {

    const router = useRouter();

    useEffect(() => {
        // Since authentication is removed, redirect directly to dashboard
        router.push("/dashboard");
    }, [router]);

    return (
        <div className="flex items-center justify-center flex-col h-screen relative">
            <div className="border-[3px] border-neutral-800 rounded-full border-b-neutral-200 animate-loading w-8 h-8"></div>
            <p className="text-lg font-medium text-center mt-3">
                Redirecting to dashboard...
            </p>
        </div>
    )
};

export default AuthCallbackPage;
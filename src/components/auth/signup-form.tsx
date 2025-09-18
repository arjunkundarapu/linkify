"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SignUpForm = () => {
    const router = useRouter();

    useEffect(() => {
        // Since authentication is removed, redirect to dashboard
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center gap-y-6 py-8 w-full px-0.5">
            <h2 className="text-2xl font-semibold">
                Redirecting to Dashboard
            </h2>
            <p className="text-muted-foreground text-center">
                Authentication has been removed. You&apos;ll be redirected to the dashboard.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
                Go to Dashboard
            </Button>
        </div>
    )
};

export default SignUpForm

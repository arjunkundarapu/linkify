export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SmartRecruit AI";

export const APP_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://your-livekit-server";
export const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "";
export const LIVEKIT_SECRET_KEY = process.env.LIVEKIT_SECRET_KEY || "";

export const APP_HOSTNAMES = new Set([
    process.env.NEXT_PUBLIC_APP_DOMAIN,
    `www.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
]);

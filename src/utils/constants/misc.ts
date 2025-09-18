import { BrainCircuitIcon, LineChartIcon, UsersIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Asana",
        logo: "/assets/company-01.svg",
    },
    {
        name: "Tidal",
        logo: "/assets/company-02.svg",
    },
    {
        name: "Innovaccer",
        logo: "/assets/company-03.svg",
    },
    {
        name: "Linear",
        logo: "/assets/company-04.svg",
    },
    {
        name: "Raycast",
        logo: "/assets/company-05.svg",
    },
    {
        name: "Labelbox",
        logo: "/assets/company-06.svg",
    }
] as const;

export const PROCESS = [
    {
        title: "Setup Interview AI",
        description: "Configure your AI interviewer with custom questions and evaluation criteria.",
        icon: BrainCircuitIcon,
    },
    {
        title: "Conduct Interviews",
        description: "Let candidates interact with AI in real-time video interviews using LiveKit.",
        icon: UsersIcon,
    },
    {
        title: "Analyze Results",
        description: "Get detailed insights and analytics on candidate performance and responses.",
        icon: LineChartIcon,
    },
] as const;

export const FEATURES = [
    {
        title: "AI-Powered Interviews",
        description: "Conduct intelligent automated interviews with advanced AI.",
    },
    {
        title: "Real-time Analytics",
        description: "Track and analyze candidate performance and responses.",
    },
    {
        title: "Video Integration",
        description: "Seamless video interviews with LiveKit technology.",
    },
    {
        title: "Smart Evaluation",
        description: "Get AI-generated insights and candidate assessments.",
    },
    {
        title: "Interview Scheduling",
        description: "Automated scheduling and candidate management.",
    },
    {
        title: "Team Collaboration",
        description: "Share insights with your hiring team in real-time.",
    },
] as const;

// Removed REVIEWS - not needed for core SRA functionality

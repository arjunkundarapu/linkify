import { BrainCircuitIcon, HelpCircleIcon, MicIcon, NewspaperIcon, UsersIcon, VideoIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "AI Interviews",
                tagline: "Conduct intelligent, automated interviews with AI.",
                href: "/features/ai-interviews",
                icon: BrainCircuitIcon,
            },
            {
                title: "Video Interviews",
                tagline: "Real-time video interviews with LiveKit integration.",
                href: "/features/video-interviews",
                icon: VideoIcon,
            },
            {
                title: "Candidate Management",
                tagline: "Manage candidates and interview schedules.",
                href: "/features/candidate-management",
                icon: UsersIcon,
            },
        ],
    },
    {
        title: "Enterprise",
        href: "/enterprise",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "Read articles on AI recruiting and best practices.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions about AI interviews.",
                href: "/resources/help",
                icon: HelpCircleIcon,
            },
        ]
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
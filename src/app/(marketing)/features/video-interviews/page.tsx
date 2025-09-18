import { AnimationContainer, MaxWidthWrapper } from "@/components";

const VideoInterviewsPage = () => {
    return (
        <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
            <AnimationContainer delay={0.1} className="w-full">
                <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
                    Real-Time Video Interviews
                </h1>
                
                <div className="mt-8 text-muted-foreground space-y-6">
                    <p>
                        Experience seamless video interviews powered by LiveKit technology. 
                        Connect with candidates in real-time with crystal-clear audio and video quality.
                    </p>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Features
                    </h2>
                    
                    <ul className="list-disc ml-6 space-y-2">
                        <li>High-quality video and audio streaming</li>
                        <li>Screen sharing capabilities</li>
                        <li>Recording and playback functionality</li>
                        <li>Multi-participant interviews</li>
                        <li>Mobile and desktop compatibility</li>
                        <li>Secure, encrypted connections</li>
                    </ul>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Getting Started
                    </h2>
                    
                    <p>
                        Schedule interviews directly from your dashboard. Candidates receive 
                        a secure link to join the interview at the scheduled time. No downloads required!
                    </p>
                </div>
            </AnimationContainer>
        </MaxWidthWrapper>
    );
};

export default VideoInterviewsPage;
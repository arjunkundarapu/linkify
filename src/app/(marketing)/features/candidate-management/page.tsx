import { AnimationContainer, MaxWidthWrapper } from "@/components";

const CandidateManagementPage = () => {
    return (
        <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
            <AnimationContainer delay={0.1} className="w-full">
                <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
                    Candidate Management
                </h1>
                
                <div className="mt-8 text-muted-foreground space-y-6">
                    <p>
                        Streamline your candidate management process with our comprehensive dashboard. 
                        Track applications, schedule interviews, and manage your entire recruitment pipeline.
                    </p>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Core Features
                    </h2>
                    
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Centralized candidate database</li>
                        <li>Application tracking system</li>
                        <li>Interview scheduling and management</li>
                        <li>Candidate scoring and evaluation</li>
                        <li>Communication history tracking</li>
                        <li>Collaborative hiring tools</li>
                    </ul>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Workflow Management
                    </h2>
                    
                    <p>
                        Customize your hiring workflow with stages that match your process. 
                        Move candidates through different phases and track their progress in real-time.
                    </p>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Team Collaboration
                    </h2>
                    
                    <p>
                        Enable your entire hiring team to collaborate effectively. Share feedback, 
                        compare candidate scores, and make informed hiring decisions together.
                    </p>
                </div>
            </AnimationContainer>
        </MaxWidthWrapper>
    );
};

export default CandidateManagementPage;
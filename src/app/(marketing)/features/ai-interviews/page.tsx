import { AnimationContainer, MaxWidthWrapper } from "@/components";

const AIInterviewsPage = () => {
    return (
        <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
            <AnimationContainer delay={0.1} className="w-full">
                <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
                    AI-Powered Interviews
                </h1>
                
                <div className="mt-8 text-muted-foreground space-y-6">
                    <p>
                        Transform your recruitment process with our advanced AI interviewer. 
                        Conduct intelligent, automated interviews that adapt to each candidate's responses.
                    </p>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        How It Works
                    </h2>
                    
                    <p>
                        Our AI interviewer uses natural language processing to conduct dynamic interviews,
                        ask follow-up questions, and evaluate candidate responses in real-time.
                    </p>
                    
                    <h2 className="text-xl font-medium text-foreground mt-8">
                        Key Benefits
                    </h2>
                    
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Consistent interview experience for all candidates</li>
                        <li>Reduces hiring bias with objective evaluation</li>
                        <li>Saves time for hiring managers</li>
                        <li>24/7 availability for candidate interviews</li>
                        <li>Detailed analytics and insights</li>
                    </ul>
                </div>
            </AnimationContainer>
        </MaxWidthWrapper>
    );
};

export default AIInterviewsPage;
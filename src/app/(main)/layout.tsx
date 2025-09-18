import { MaxWidthWrapper } from "@/components";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <MaxWidthWrapper>
            <main className="w-full relative py-8">
                {children}
            </main>
        </MaxWidthWrapper>
    );
};

export default MainLayout;
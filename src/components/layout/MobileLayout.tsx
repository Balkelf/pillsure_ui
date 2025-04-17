
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import MobileNavigation from "./MobileNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <main className={cn("flex-1 container max-w-md mx-auto px-4 pt-6 pb-20", className)}>
        {children}
      </main>
      <MobileNavigation className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t" />
    </div>
  );
};

export default MobileLayout;

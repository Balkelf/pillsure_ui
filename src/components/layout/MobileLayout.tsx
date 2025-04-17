
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
      <header className="p-4 border-b bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/251ab6a9-066c-4958-873a-95bf6072b484.png" 
            alt="PillSure Logo" 
            className="h-8" 
          />
          <span className="font-semibold text-lg text-primary">PillSure</span>
        </div>
      </header>
      <main className={cn("flex-1 container max-w-md mx-auto px-4 pt-6 pb-20", className)}>
        {children}
      </main>
      <MobileNavigation className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t" />
    </div>
  );
};

export default MobileLayout;

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import MobileNavigation from "./MobileNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
}

const MobileLayout = ({ 
  children, 
  className,
  hideNavigation = false 
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={cn(
        "flex-1 container max-w-md mx-auto px-4 pt-6 pb-24", 
        hideNavigation ? "pb-6" : "pb-24",
        className
      )}>
        <div className="animate-slide-up">
        {children}
        </div>
      </main>
      
      {!hideNavigation && (
        <MobileNavigation className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-sm" />
      )}
    </div>
  );
};

export default MobileLayout;

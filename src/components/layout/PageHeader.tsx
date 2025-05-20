import React from "react";
import { ArrowLeft, Info, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  backTo,
  rightAction,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn("flex flex-col space-y-1 mb-6", className)}>
      <div className="flex items-center justify-between h-10">
        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <div className="w-9" />
        )}
        
        <h1 className="text-xl font-semibold leading-tight text-center flex-1 mx-2">
          {title}
        </h1>
        
        {rightAction ? (
          rightAction
        ) : (
          <div className="w-9" />
        )}
      </div>
      
      {subtitle && (
        <p className="text-sm text-muted-foreground font-light text-center">
          {subtitle}
        </p>
      )}
    </header>
  );
};

export const InfoButton = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors"
    aria-label="Information"
  >
    <Info className="h-5 w-5" />
  </Link>
);

export const SettingsButton = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors"
    aria-label="Settings"
  >
    <Settings className="h-5 w-5" />
  </Link>
); 
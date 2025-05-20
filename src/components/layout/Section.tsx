import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const Section = ({
  title,
  description,
  children,
  action,
  className,
  contentClassName,
}: SectionProps) => {
  return (
    <section className={cn("mb-6", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          <div>
            {title && (
              <h2 className="text-lg font-medium leading-tight">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground font-light mt-1">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn("", contentClassName)}>{children}</div>
    </section>
  );
};

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading = ({
  title,
  subtitle,
  action,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div>
        <h2 className="text-lg font-medium leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground font-light mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardSection = ({ children, className }: CardSectionProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  );
}; 
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, PieChart, Bell, User, Pill } from "lucide-react";

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation = ({ className }: MobileNavigationProps) => {
  const location = useLocation();
  
  // Navigation items based on the style guide example
  const navItems = [
    { icon: Pill, label: "Meds", path: "/medications" },
    { icon: Bell, label: "Reminders", path: "/reminders" },
    { icon: Home, label: "Home", path: "/" },
    { icon: PieChart, label: "Insights", path: "/insights" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className={cn("flex justify-around items-center py-3 px-2", className)}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 touch-target tap-highlight rounded-md transition-colors",
              isActive ? "text-primary" : "text-muted-foreground font-light hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon 
              className={cn(
                "h-6 w-6 mb-1 transition-all", 
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground font-light group-hover:text-foreground"
              )} 
            />
            <span className={cn(
              "text-xs font-medium", 
              isActive ? "text-primary" : "text-muted-foreground font-light"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;

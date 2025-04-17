
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, PieChart, Calendar, Bell, User } from "lucide-react";

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation = ({ className }: MobileNavigationProps) => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Meds", path: "/medications" },
    { icon: Bell, label: "Reminders", path: "/reminders" },
    { icon: PieChart, label: "Insights", path: "/insights" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className={cn("flex justify-around items-center py-2 px-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex flex-col items-center justify-center px-3 py-2"
        >
          <item.icon className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs mt-1 text-muted-foreground">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavigation;

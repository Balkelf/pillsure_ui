
import { CalendarClock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DeviceModeSectionProps {
  deviceMode: "daily" | "multiday";
}

export const DeviceModeSection = ({ deviceMode }: DeviceModeSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          {deviceMode === "daily" ? (
            <CalendarClock className="h-5 w-5 text-primary" />
          ) : (
            <CalendarDays className="h-5 w-5 text-primary" />
          )}
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-sm font-medium">
              {deviceMode === "daily" ? "Daily Refill Mode" : "Multi-Day Refill Mode"}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 h-6 text-xs"
              onClick={() => navigate("/setup")}
            >
              Change
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-light">
            {deviceMode === "daily" 
              ? "Refill compartments daily" 
              : "Each compartment holds a 3-day supply"}
          </p>
        </div>
      </div>
    </div>
  );
};

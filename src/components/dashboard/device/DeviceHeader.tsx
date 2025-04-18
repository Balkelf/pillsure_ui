
import { Battery, BatteryMedium, Box, CalendarDays, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceHeaderProps {
  batteryLevel: number;
  lastSync: string;
  onManualSync: () => void;
  onConfigureClick: () => void;
}

export const DeviceHeader = ({
  batteryLevel,
  lastSync,
  onManualSync,
  onConfigureClick,
}: DeviceHeaderProps) => {
  const getBatteryIcon = (level: number) => {
    if (level <= 20) {
      return <Battery className="h-5 w-5 text-red-500" />;
    } else if (level <= 50) {
      return <BatteryMedium className="h-5 w-5 text-orange-400" />;
    } else {
      return <Battery className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="bg-secondary/10 p-2 rounded-full mr-3">
          <Box className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-medium">PillSure Device</h3>
          <p className="text-sm text-muted-foreground">Last synced: {lastSync}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {getBatteryIcon(batteryLevel)}
          <span className="ml-1 text-sm font-medium">{batteryLevel}%</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onManualSync}>
          <CalendarDays className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onConfigureClick}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

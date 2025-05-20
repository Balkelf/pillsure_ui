import { Battery, BatteryMedium, BatteryCharging, BatteryWarning } from "lucide-react";

interface DeviceHeaderProps {
  batteryLevel: number | null;
  lastSync: string;
  isCharging?: boolean;
  serialNumber?: string;
}

export const DeviceHeader = ({
  batteryLevel,
  lastSync,
  isCharging = false,
  serialNumber = "Unknown",
}: DeviceHeaderProps) => {
  // Improved checking for unknown/invalid battery level
  // First explicitly convert to number if it's not null
  const numericBattery = batteryLevel !== null ? Number(batteryLevel) : null;
  
  // Now check if it's a valid number
  const isUnknown = numericBattery === null || isNaN(numericBattery);
  
  // Only use the level for icons if it's not unknown
  const safeLevel = isUnknown ? null : numericBattery;
  
  // Log what we're displaying for debugging
  console.log(`DeviceHeader: battery=${batteryLevel}, safeLevel=${safeLevel}, isUnknown=${isUnknown}, isCharging=${isCharging}`);
  
  const getBatteryIcon = (level: number | null, charging: boolean) => {
    if (charging) {
      return <BatteryCharging className="h-5 w-5 text-green-500" />;
    } else if (level === null) {
      // Unknown battery level
      return <BatteryWarning className="h-5 w-5 text-orange-500" />;
    } else if (level === 0) {
      // Special case for 0% battery
      return <Battery className="h-5 w-5 text-red-700" />;
    } else if (level <= 20) {
      return <Battery className="h-5 w-5 text-red-500" />;
    } else if (level <= 50) {
      return <BatteryMedium className="h-5 w-5 text-orange-400" />;
    } else {
      return <Battery className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="flex flex-col mb-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">PillSure Device</h3>
        <div className="flex items-center">
          {getBatteryIcon(safeLevel, isCharging)}
          <span className={`ml-1 text-sm font-medium ${
            isUnknown ? 'text-orange-500' : 
            safeLevel === 0 ? 'text-red-700' : ''
          }`}>
            {isUnknown ? 'Unknown' : `${safeLevel}%`}
            {isCharging && " (Charging)"}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">S/N: {serialNumber}</p>
      <p className="text-sm text-muted-foreground font-light">Last synced: {lastSync}</p>
    </div>
  );
};

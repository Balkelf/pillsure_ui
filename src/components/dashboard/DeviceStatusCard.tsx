
import { Card, CardContent } from "@/components/ui/card";
import { Battery, BatteryMedium, Box, Pill } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CompartmentStatus {
  id: number;
  name: string;
  pillCount: number;
  maxCapacity: number;
  pillType: string;
  schedule?: string;
}

interface DeviceStatusCardProps {
  className?: string;
  batteryLevel?: number;
  lastSync?: string;
  compartments?: CompartmentStatus[];
}

const DeviceStatusCard = ({
  className,
  batteryLevel = 75,
  lastSync = "Today at 08:15 AM",
  compartments = [
    { id: 1, name: "Compartment 1", schedule: "Morning", pillCount: 28, maxCapacity: 30, pillType: "Metformin" },
    { id: 2, name: "Compartment 2", schedule: "Afternoon", pillCount: 14, maxCapacity: 30, pillType: "Lisinopril" },
    { id: 3, name: "Compartment 3", schedule: "Evening", pillCount: 5, maxCapacity: 30, pillType: "Aspirin" },
  ],
}: DeviceStatusCardProps) => {
  
  const getBatteryIcon = (level: number) => {
    if (level <= 20) {
      return <Battery className="h-5 w-5 text-red-500" />;
    } else if (level <= 50) {
      return <BatteryMedium className="h-5 w-5 text-orange-400" />;
    } else {
      return <Battery className="h-5 w-5 text-green-500" />;
    }
  };

  const getCompartmentColorClass = (pillCount: number, maxCapacity: number) => {
    const percentage = (pillCount / maxCapacity) * 100;
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 50) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <Card className={cn("border-2 border-secondary/10 shadow-sm", className)}>
      <CardContent className="p-4">
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
          <div className="flex items-center">
            {getBatteryIcon(batteryLevel)}
            <span className="ml-1 text-sm font-medium">{batteryLevel}%</span>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">3-Compartment Status</h4>
          
          {compartments.map((compartment) => (
            <div key={compartment.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Pill className="h-4 w-4 mr-1 text-primary" />
                  <span>{compartment.name} {compartment.schedule && `(${compartment.schedule})`} - {compartment.pillType}</span>
                </div>
                <span className="font-medium">
                  {compartment.pillCount}/{compartment.maxCapacity}
                </span>
              </div>
              <Progress
                value={(compartment.pillCount / compartment.maxCapacity) * 100}
                className="h-2"
                indicatorClassName={getCompartmentColorClass(compartment.pillCount, compartment.maxCapacity)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;

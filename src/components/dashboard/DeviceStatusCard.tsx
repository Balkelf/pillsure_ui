
import { Card, CardContent } from "@/components/ui/card";
import { Battery, BatteryMedium, Box, Pill, CalendarDays, ClockIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CompartmentStatus {
  id: number;
  name: string;
  pillCount: number;
  maxCapacity: number;
  pillType: string;
  schedule?: string;
  description?: string;
  instructions?: string;
}

interface DeviceStatusCardProps {
  className?: string;
  batteryLevel?: number;
  lastSync?: string;
  startDate?: string;
  compartments?: CompartmentStatus[];
}

const DeviceStatusCard = ({
  className,
  batteryLevel = 75,
  lastSync = "Today at 08:15 AM",
  startDate = "2023-04-10",
  compartments = [
    { 
      id: 1, 
      name: "Compartment 1", 
      schedule: "Week 1", 
      pillCount: 5, 
      maxCapacity: 5, 
      pillType: "Metformin 500mg", 
      description: "Once daily with breakfast",
      instructions: "Fill with 5 tablets (500mg) for week 1"
    },
    { 
      id: 2, 
      name: "Compartment 2", 
      schedule: "Week 2", 
      pillCount: 5, 
      maxCapacity: 5, 
      pillType: "Metformin 500mg", 
      description: "Twice daily with breakfast & dinner",
      instructions: "Fill with 5 tablets (500mg). Refill when empty (2-3 days)." 
    },
    { 
      id: 3, 
      name: "Compartment 3", 
      schedule: "Week 3+", 
      pillCount: 5, 
      maxCapacity: 5, 
      pillType: "Metformin 500mg", 
      description: "Three times daily with each meal",
      instructions: "Fill with 5 tablets (500mg). Refill frequently (1-2 days)." 
    },
  ],
}: DeviceStatusCardProps) => {
  const [showInstructions, setShowInstructions] = useState(false);
  
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

  // Calculate current week based on start date
  const calculateCurrentWeek = () => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 1;
    if (diffDays <= 14) return 2;
    return 3;
  };

  const currentWeek = calculateCurrentWeek();

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

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm">Started on: {new Date(startDate).toLocaleDateString()}</p>
              <p className="text-sm font-medium text-primary">Currently in Week {currentWeek}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowInstructions(!showInstructions)} 
            className="text-sm text-primary hover:underline flex items-center"
          >
            {showInstructions ? "Hide" : "Show"} filling instructions
          </button>
        </div>

        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Metformin Titration Schedule</h4>
          
          {compartments.map((compartment) => (
            <div key={compartment.id} className={`space-y-1 ${compartment.id === currentWeek ? 'bg-primary/5 p-3 rounded-md -mx-3' : ''}`}>
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Pill className="h-4 w-4 mr-1 text-primary" />
                  <span>
                    {compartment.name} ({compartment.schedule}) - {compartment.pillType}
                  </span>
                </div>
                <span className="font-medium">
                  {compartment.pillCount}/{compartment.maxCapacity}
                </span>
              </div>
              {compartment.description && (
                <p className="text-xs text-muted-foreground ml-5">{compartment.description}</p>
              )}
              {showInstructions && compartment.instructions && (
                <p className="text-xs bg-blue-50 p-2 rounded border border-blue-100 text-blue-700 ml-5 mt-1">
                  {compartment.instructions}
                </p>
              )}
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

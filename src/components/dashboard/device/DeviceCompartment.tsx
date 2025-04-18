
import { Pill, Clock, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CompartmentMedication } from "@/lib/types/compartments";

interface DeviceCompartmentProps {
  id: string | number;
  name: string;
  maxCapacity: number;
  currentCapacity: number;
  medications: CompartmentMedication[];
  isConfigureMode: boolean;
  isSelected: boolean;
  deviceMode: "daily" | "multiday";
  showDetails: boolean;
  onSelect: (id: string | number) => void;
}

export const DeviceCompartment = ({
  id,
  name,
  maxCapacity,
  currentCapacity,
  medications,
  isConfigureMode,
  isSelected,
  deviceMode,
  showDetails,
  onSelect,
}: DeviceCompartmentProps) => {
  const getCompartmentColorClass = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 50) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <div 
      className={`border rounded-md p-3 space-y-2 ${isSelected ? "border-primary" : ""}`}
      onClick={() => isConfigureMode && onSelect(id)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Pill className="h-4 w-4 mr-1 text-primary" />
          <span className="font-medium">{name} Compartment</span>
          {medications.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {medications[0].name}
            </Badge>
          )}
        </div>
        <span className="text-sm">
          {currentCapacity}/{maxCapacity} tablets
        </span>
      </div>
      
      {showDetails && medications.map((med) => (
        <div key={med.id} className="flex justify-between items-center text-sm pl-5">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>
              {med.name} {med.dosage} ({med.time})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {med.count} tablet{med.count > 1 ? 's' : ''}
              {deviceMode === "multiday" && " (3-day supply)"}
            </span>
            {isConfigureMode && isSelected && (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  disabled={med.count <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  disabled={currentCapacity >= maxCapacity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      
      <Progress
        value={(currentCapacity / maxCapacity) * 100}
        className="h-2"
        indicatorClassName={getCompartmentColorClass(currentCapacity, maxCapacity)}
      />
      
      {currentCapacity >= maxCapacity && (
        <p className="text-xs text-orange-600">
          Compartment at max capacity (5 tablets)
        </p>
      )}
    </div>
  );
};

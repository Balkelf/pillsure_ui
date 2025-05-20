import { Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CompartmentStatus } from "@/lib/types/compartments";

interface DeviceCompartmentProps {
  compartment: CompartmentStatus;
  configureMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const DeviceCompartment = ({
  compartment,
  configureMode,
  isSelected,
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
      onClick={configureMode ? onSelect : undefined}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Pill className="h-4 w-4 mr-1 text-primary" />
          <span className="font-medium">{compartment.name}</span>
          {compartment.medications.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {compartment.medications[0].name}
            </Badge>
          )}
        </div>
        <span className="text-sm">
          {compartment.currentCapacity}/{compartment.maxCapacity} tablets
        </span>
      </div>
      
      <Progress
        value={(compartment.currentCapacity / compartment.maxCapacity) * 100}
        className="h-2"
        indicatorClassName={getCompartmentColorClass(compartment.currentCapacity, compartment.maxCapacity)}
      />
      
      {compartment.currentCapacity >= compartment.maxCapacity && (
        <p className="text-xs text-orange-600">
          Compartment at max capacity ({compartment.maxCapacity} tablets)
        </p>
      )}
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlertCircle, PillIcon } from "lucide-react";
import DeviceStatusCard from "@/components/dashboard/DeviceStatusCard";

interface CompartmentConfigProps {
  deviceMode: "daily" | "multiday";
  setDeviceMode: (mode: "daily" | "multiday") => void;
  currentWeek: number;
  handleConfigureCompartments: () => void;
  getCompartmentConfig: () => Array<{
    id: number;
    name: string;
    maxCapacity: number;
    currentCapacity: number;
    medications: Array<{
      id: number;
      name: string;
      dosage: string;
      count: number;
      time: string;
    }>;
  }>;
}

const CompartmentConfig = ({
  deviceMode,
  setDeviceMode,
  currentWeek,
  handleConfigureCompartments,
  getCompartmentConfig,
}: CompartmentConfigProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Configure Device Compartments</h3>
      <p className="text-sm text-muted-foreground font-light">
        Each compartment can hold up to 5 tablets of a single medication type. Configure separate compartments for each medication.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h4 className="text-sm font-medium text-blue-800">Device Mode</h4>
        <p className="text-xs text-blue-700 mt-1 mb-3">
          Select your preferred dispensing mode for your PillSure device
        </p>
        
        <ToggleGroup 
          type="single" 
          value={deviceMode} 
          onValueChange={(value) => {
            if (value) setDeviceMode(value as "daily" | "multiday");
          }}
          className="justify-start"
        >
          <ToggleGroupItem value="daily" className="whitespace-nowrap">
            <span className="text-sm">Daily Dispensing</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="multiday" className="whitespace-nowrap">
            <span className="text-sm">3-Day Supply</span>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="mt-3 text-xs text-blue-700">
          {deviceMode === "daily" ? (
            <p>Daily mode: Refill compartments each day for your daily medication needs.</p>
          ) : (
            <p>3-Day mode: Each compartment holds a 3-day supply of medications. Less frequent refills required.</p>
          )}
        </div>
      </div>
      
      <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
        <h4 className="text-sm font-medium text-amber-800 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Important: One Medication Per Compartment
        </h4>
        <p className="text-xs text-amber-700 mt-1">
          To prevent confusion when taking medications on future days, each compartment should only contain one type of medication.
        </p>
      </div>
      
      <DeviceStatusCard 
        onConfigureCompartments={handleConfigureCompartments} 
      />
      
      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mt-4">
        <h4 className="text-sm font-medium text-yellow-800 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Refill Recommendations
        </h4>
        <p className="text-xs text-yellow-700 mt-1">
          {deviceMode === "daily" && currentWeek === 1 && "With one daily dose, you'll likely need to refill every day."}
          {deviceMode === "daily" && currentWeek === 2 && "With two daily doses, you'll likely need to refill every day."}
          {deviceMode === "daily" && currentWeek === 3 && "With three daily doses, you'll need to refill daily."}
          {deviceMode === "multiday" && currentWeek === 1 && "With one daily dose in 3-day mode, you'll need to refill every 3 days."}
          {deviceMode === "multiday" && currentWeek === 2 && "With two daily doses in 3-day mode, you'll need to refill every 3 days."}
          {deviceMode === "multiday" && currentWeek === 3 && "With three daily doses in 3-day mode, you'll need to refill every 3 days."}
        </p>
      </div>
    </div>
  );
};

export default CompartmentConfig;

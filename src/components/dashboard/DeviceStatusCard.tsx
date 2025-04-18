
import { Card, CardContent } from "@/components/ui/card";
import { Battery, BatteryMedium, Box, Pill, CalendarDays, Clock, Settings, Plus, Minus, AlertCircle, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface MedicationInCompartment {
  id: number;
  name: string;
  dosage: string;
  count: number;
  time: string;
}

interface CompartmentStatus {
  id: number;
  name: string;
  maxCapacity: number;
  currentCapacity: number;
  medications: MedicationInCompartment[];
}

interface DeviceStatusCardProps {
  className?: string;
  batteryLevel?: number;
  lastSync?: string;
  startDate?: string;
  onConfigureCompartments?: () => void;
}

const DeviceStatusCard = ({
  className,
  batteryLevel = 75,
  lastSync = "Today at 08:15 AM",
  startDate = "2023-04-10",
  onConfigureCompartments,
}: DeviceStatusCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [configureMode, setConfigureMode] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("metformin");
  const [selectedCount, setSelectedCount] = useState("1");
  const [selectedCompartment, setSelectedCompartment] = useState<number | null>(null);
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [compartments, setCompartments] = useState<CompartmentStatus[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Update compartments whenever device mode changes
    setCompartments(getCompartments());
  }, [deviceMode]);

  const getCompartments = () => {
    if (deviceMode === "daily") {
      return [
        { 
          id: 1, 
          name: "Morning", 
          maxCapacity: 5,
          currentCapacity: 2,
          medications: [
            { id: 1, name: "Metformin", dosage: "500mg", count: 1, time: "8:00 AM" },
            { id: 2, name: "Lisinopril", dosage: "10mg", count: 1, time: "8:00 AM" }
          ]
        },
        { 
          id: 2, 
          name: "Lunch", 
          maxCapacity: 5,
          currentCapacity: 1,
          medications: [
            { id: 3, name: "Metformin", dosage: "500mg", count: 1, time: "1:00 PM" }
          ]
        },
        { 
          id: 3, 
          name: "Evening", 
          maxCapacity: 5,
          currentCapacity: 1,
          medications: [
            { id: 4, name: "Metformin", dosage: "500mg", count: 1, time: "7:00 PM" }
          ]
        }
      ];
    } else {
      return [
        { 
          id: 1, 
          name: "Morning (3-Day Supply)", 
          maxCapacity: 5,
          currentCapacity: 4,
          medications: [
            { id: 1, name: "Metformin", dosage: "500mg", count: 3, time: "8:00 AM (3 days)" },
            { id: 2, name: "Lisinopril", dosage: "10mg", count: 1, time: "8:00 AM (3 days)" }
          ]
        },
        { 
          id: 2, 
          name: "Lunch (3-Day Supply)", 
          maxCapacity: 5,
          currentCapacity: 3,
          medications: [
            { id: 3, name: "Metformin", dosage: "500mg", count: 3, time: "1:00 PM (3 days)" }
          ]
        },
        { 
          id: 3, 
          name: "Evening (3-Day Supply)", 
          maxCapacity: 5,
          currentCapacity: 3,
          medications: [
            { id: 4, name: "Metformin", dosage: "500mg", count: 3, time: "7:00 PM (3 days)" }
          ]
        }
      ];
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level <= 20) {
      return <Battery className="h-5 w-5 text-red-500" />;
    } else if (level <= 50) {
      return <BatteryMedium className="h-5 w-5 text-orange-400" />;
    } else {
      return <Battery className="h-5 w-5 text-green-500" />;
    }
  };

  const getCompartmentColorClass = (currentCapacity: number, maxCapacity: number) => {
    const percentage = (currentCapacity / maxCapacity) * 100;
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 50) return "bg-orange-400";
    return "bg-green-500";
  };

  const handleConfigureClick = () => {
    if (onConfigureCompartments) {
      onConfigureCompartments();
    } else {
      setConfigureMode(!configureMode);
    }
  };

  const handleSelectCompartment = (compartmentId: number) => {
    setSelectedCompartment(selectedCompartment === compartmentId ? null : compartmentId);
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
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {getBatteryIcon(batteryLevel)}
              <span className="ml-1 text-sm font-medium">{batteryLevel}%</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleConfigureClick}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

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
              <p className="text-xs text-muted-foreground">
                {deviceMode === "daily" 
                  ? "Refill compartments daily" 
                  : "Each compartment holds a 3-day supply"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            className="text-sm text-primary hover:underline flex items-center"
          >
            {showDetails ? "Hide" : "Show"} details
          </button>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Device Compartments</h4>
            {configureMode && (
              <div className="flex items-center gap-1">
                <Select 
                  value={selectedMedication} 
                  onValueChange={setSelectedMedication}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metformin">Metformin 500mg</SelectItem>
                    <SelectItem value="lisinopril">Lisinopril 10mg</SelectItem>
                    <SelectItem value="aspirin">Aspirin 81mg</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={selectedCount} 
                  onValueChange={setSelectedCount}
                >
                  <SelectTrigger className="h-7 w-16 text-xs">
                    <SelectValue placeholder="Count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mb-2">
            <p className="text-xs text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {deviceMode === "daily" 
                ? "Each compartment contains one day's dose for a specific time of day" 
                : "Each compartment contains a 3-day supply for a specific time of day"}
            </p>
          </div>
          
          {compartments.map((compartment) => (
            <div 
              key={compartment.id} 
              className={cn(
                "border rounded-md p-3 space-y-2", 
                selectedCompartment === compartment.id && "border-primary"
              )}
              onClick={configureMode ? () => handleSelectCompartment(compartment.id) : undefined}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Pill className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{compartment.name} Compartment</span>
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
              
              {showDetails && (
                <div className="pl-5 space-y-1">
                  {compartment.medications.map((med) => (
                    <div key={med.id} className="flex justify-between items-center text-sm">
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
                        {configureMode && selectedCompartment === compartment.id && (
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
                              disabled={compartment.currentCapacity >= compartment.maxCapacity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Progress
                value={(compartment.currentCapacity / compartment.maxCapacity) * 100}
                className="h-2"
                indicatorClassName={getCompartmentColorClass(compartment.currentCapacity, compartment.maxCapacity)}
              />
              
              {compartment.currentCapacity >= compartment.maxCapacity && (
                <p className="text-xs text-orange-600">
                  Compartment at max capacity (5 tablets)
                </p>
              )}
            </div>
          ))}
          
          {configureMode && (
            <div className="mt-4">
              <Button variant="outline" className="w-full" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Add new compartment
              </Button>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setConfigureMode(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => {
                  setConfigureMode(false);
                  toast.success("Device configuration updated");
                }}>
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetchDeviceData, subscribeToDeviceUpdates, syncDeviceData } from "@/services/deviceSync";
import { Device } from "@/lib/types/devices";
import { DeviceHeader } from "./device/DeviceHeader";
import { DeviceModeSection } from "./device/DeviceModeSection";
import { DeviceCompartment } from "./device/DeviceCompartment";

interface DeviceStatusCardProps {
  className?: string;
  batteryLevel?: number;
  lastSync?: string;
  startDate?: string;
  onConfigureCompartments?: () => void;
}

const DeviceStatusCard = ({
  className,
  batteryLevel: defaultBatteryLevel = 75,
  lastSync: defaultLastSync = "Today at 08:15 AM",
  startDate = "2023-04-10",
  onConfigureCompartments,
}: DeviceStatusCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [configureMode, setConfigureMode] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("metformin");
  const [selectedCount, setSelectedCount] = useState("1");
  const [selectedCompartment, setSelectedCompartment] = useState<number | string | null>(null);
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [compartments, setCompartments] = useState<CompartmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(defaultBatteryLevel);
  const [lastSync, setLastSync] = useState(defaultLastSync);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        setLoading(true);
        const device = await fetchDeviceData();
        
        if (device) {
          setDeviceId(device.device_id);
          setBatteryLevel(device.battery_level || defaultBatteryLevel);
          setDeviceMode(device.device_mode || "daily");
          setLastSync(formatDateTime(device.last_sync) || defaultLastSync);
          
          const mappedCompartments = device.device_compartments.map(compartment => {
            return {
              id: compartment.id,
              name: compartment.name,
              maxCapacity: compartment.max_capacity,
              currentCapacity: compartment.current_capacity,
              medications: compartment.medications?.map(med => ({
                id: med.id,
                name: med.name,
                dosage: med.dosage || "",
                count: med.count,
                time: med.time || ""
              })) || []
            };
          });
          
          setCompartments(mappedCompartments);
        } else {
          loadDefaultCompartments();
        }
      } catch (error) {
        console.error("Error loading device data:", error);
        loadDefaultCompartments();
      } finally {
        setLoading(false);
      }
    };
    
    loadDeviceData();
    
    const unsubscribe = subscribeToDeviceUpdates((device) => {
      if (device) {
        setBatteryLevel(device.battery_level || defaultBatteryLevel);
        setDeviceMode(device.device_mode || "daily");
        setLastSync(formatDateTime(device.last_sync) || defaultLastSync);
        
        if (!loading) {
          setCompartments(getCompartments());
        }
      }
    });
    
    return unsubscribe;
  }, [defaultBatteryLevel, defaultLastSync]);
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return dateString;
    }
  };
  
  const loadDefaultCompartments = () => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
    
    setCompartments(getCompartments());
  };
  
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

  const handleManualSync = async () => {
    try {
      toast.loading("Syncing with device...");
      
      const deviceData = {
        device_id: deviceId || "pillsure-demo-device",
        battery_level: Math.floor(Math.random() * 30) + 70,
        device_mode: deviceMode,
        compartments: compartments.map(compartment => ({
          name: compartment.name,
          max_capacity: compartment.maxCapacity,
          current_capacity: compartment.currentCapacity,
          medications: compartment.medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            count: med.count,
            time: med.time,
          }))
        }))
      };
      
      await syncDeviceData(deviceData);
      toast.dismiss();
      toast.success("Device synced successfully");
      
      setLastSync(formatDateTime(new Date().toISOString()));
    } catch (error) {
      toast.dismiss();
      toast.error(`Sync failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Card className={cn("border-2 border-secondary/10 shadow-sm", className)}>
        <CardContent className="p-4 flex justify-center items-center h-40">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading device data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-secondary/10 shadow-sm", className)}>
      <CardContent className="p-4">
        <DeviceHeader
          batteryLevel={batteryLevel}
          lastSync={lastSync}
          onManualSync={handleManualSync}
          onConfigureClick={handleConfigureClick}
        />

        <DeviceModeSection deviceMode={deviceMode} />

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
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {compartments.map((compartment) => (
            <DeviceCompartment
              key={compartment.id}
              {...compartment}
              isConfigureMode={configureMode}
              isSelected={selectedCompartment === compartment.id}
              deviceMode={deviceMode}
              showDetails={showDetails}
              onSelect={setSelectedCompartment}
            />
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

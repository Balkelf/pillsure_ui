import { toast } from "@/components/ui/sonner";
import { Device, DeviceCompartment, CompartmentMedication, MedicationLog } from "@/lib/types/devices";
import { supabase } from "@/integrations/supabase/client"; 

export interface DeviceData {
  device_id: string;
  battery_level: number;
  device_mode: "daily" | "multiday";
  compartments: {
    name: string;
    max_capacity: number;
    current_capacity: number;
    lid_angle?: number;
    medications: {
      name: string;
      dosage: string;
      count: number;
      time: string;
      medication_id?: string;
    }[];
  }[];
  medication_logs?: {
    medication_id?: string;
    schedule_id?: string;
    status: "taken" | "missed" | "upcoming";
    scheduled_time: string;
    taken_time?: string;
  }[];
}

export const syncDeviceData = async (deviceData: DeviceData) => {
  try {
    console.log("Syncing device data:", deviceData);
    
    setTimeout(() => {
      toast.success("Device synced successfully");
    }, 1000);
    
    return { success: true, data: deviceData };
  } catch (error) {
    console.error("Device sync error:", error);
    toast.error(`Sync failed: ${error.message}`);
    throw error;
  }
};

export const fetchDeviceData = async (): Promise<Device | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockDevice: Device = {
      id: "device-1",
      device_id: "pillsure-demo-device",
      user_id: "user-1",
      name: "PillSure Device",
      battery_level: 75,
      last_sync: new Date().toISOString(),
      status: "active",
      device_mode: "daily",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      device_compartments: [
        {
          id: "compartment-1",
          device_id: "device-1",
          name: "Morning",
          max_capacity: 5,
          current_capacity: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          medications: [
            {
              id: "med-1",
              compartment_id: "compartment-1",
              name: "Metformin",
              dosage: "500mg",
              count: 1,
              time: "8:00 AM",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "med-2",
              compartment_id: "compartment-1",
              name: "Lisinopril",
              dosage: "10mg",
              count: 1,
              time: "8:00 AM",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        },
        {
          id: "compartment-2",
          device_id: "device-1",
          name: "Lunch",
          max_capacity: 5,
          current_capacity: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          medications: [
            {
              id: "med-3",
              compartment_id: "compartment-2",
              name: "Metformin",
              dosage: "500mg",
              count: 1,
              time: "1:00 PM",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        },
        {
          id: "compartment-3",
          device_id: "device-1",
          name: "Evening",
          max_capacity: 5,
          current_capacity: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          medications: [
            {
              id: "med-4",
              compartment_id: "compartment-3",
              name: "Metformin",
              dosage: "500mg",
              count: 1,
              time: "7:00 PM",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      ]
    };
    
    return mockDevice;
  } catch (error) {
    console.error("Error fetching device data:", error);
    toast.error(`Failed to fetch device data: ${error.message}`);
    throw error;
  }
};

export const subscribeToDeviceUpdates = (onUpdate: (device: Device | null) => void) => {
  const interval = setInterval(async () => {
    try {
      const device = await fetchDeviceData();
      onUpdate(device);
    } catch (error) {
      console.error("Error in device update subscription:", error);
    }
  }, 30000);
  
  return () => {
    clearInterval(interval);
  };
};

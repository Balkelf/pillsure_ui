
import { toast } from "@/components/ui/sonner";
import { Device, DeviceCompartment, CompartmentMedication, MedicationLog } from "@/lib/types/devices";
import { SUPABASE_URL } from "@/integrations/supabase/client"; 

// Constants for Supabase
const SUPABASE_API_URL = "https://jdxwyecwdpyhaunvukaj.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHd5ZWN3ZHB5aGF1bnZ1a2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDI5MzcsImV4cCI6MjA1ODQ3ODkzN30.Ssz4HcbYKwSqswsPqzvKkCZdvvNUEH-nEAvwzmc4Jas";

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
    // Since we don't have authenticated user and database tables set up yet,
    // we'll simply mock the API call and return success for now
    console.log("Syncing device data:", deviceData);
    
    // Instead of making an actual API call, we'll simulate the response
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

// Function to fetch the latest device data
export const fetchDeviceData = async (): Promise<Device | null> => {
  try {
    // Since we don't have the device tables in our database yet,
    // we'll return mock data for now
    
    // Mock a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock device data
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

// Function to subscribe to real-time device updates
export const subscribeToDeviceUpdates = (onUpdate: (device: Device | null) => void) => {
  // Since we don't have real-time capabilities set up yet, 
  // we'll use a timer to periodically update the data
  const interval = setInterval(async () => {
    try {
      const device = await fetchDeviceData();
      onUpdate(device);
    } catch (error) {
      console.error("Error in device update subscription:", error);
    }
  }, 30000); // Update every 30 seconds
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};

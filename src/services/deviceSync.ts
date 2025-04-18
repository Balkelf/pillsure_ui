
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Device, DeviceCompartment, CompartmentMedication, MedicationLog } from "@/lib/types/devices";

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
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Call the device-sync Edge Function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/device-sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        ...deviceData,
        user_id: userData.user.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to sync device data");
    }
    
    const result = await response.json();
    toast.success("Device synced successfully");
    
    return result;
  } catch (error) {
    console.error("Device sync error:", error);
    toast.error(`Sync failed: ${error.message}`);
    throw error;
  }
};

// Function to fetch the latest device data
export const fetchDeviceData = async (): Promise<Device | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Fetch the latest device data
    const { data: devices, error: deviceError } = await supabase
      .from("devices")
      .select("*, device_compartments(*)")
      .eq("user_id", userData.user.id)
      .order("last_sync", { ascending: false })
      .limit(1);
      
    if (deviceError) throw deviceError;
    
    if (!devices || devices.length === 0) {
      return null; // No device found
    }
    
    const device = devices[0] as unknown as Device;
    
    // Fetch medications for each compartment
    const compartmentsWithMedications = await Promise.all(
      device.device_compartments.map(async (compartment) => {
        const { data: medications, error: medError } = await supabase
          .from("compartment_medications")
          .select("*")
          .eq("compartment_id", compartment.id);
          
        if (medError) throw medError;
        
        return {
          ...compartment,
          medications: medications as CompartmentMedication[] || []
        };
      })
    );
    
    return {
      ...device,
      device_compartments: compartmentsWithMedications
    };
  } catch (error) {
    console.error("Error fetching device data:", error);
    toast.error(`Failed to fetch device data: ${error.message}`);
    throw error;
  }
};

// Function to subscribe to real-time device updates
export const subscribeToDeviceUpdates = (onUpdate: (device: Device | null) => void) => {
  const channel = supabase
    .channel('device-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'devices'
      },
      (payload) => {
        // When device data changes, fetch the complete updated data
        fetchDeviceData().then(onUpdate);
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

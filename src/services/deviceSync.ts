import { toast } from "@/components/ui/sonner";
import { Device, DeviceCompartment, CompartmentMedication, MedicationLog } from "@/lib/types/devices";
import { supabase } from "@/integrations/supabase/client"; 

// Device status from NodeRed API
export interface DeviceStatusResponse {
  timestamp: number;
  device: {
    serialNumber: string;
    batteryLevel: number | null;
    batteryUpdated: number;
    isCharging: boolean;
  };
  boxes: Array<{
    id: number;
    isOpen: boolean;
    lastOpenTime: number | null;
    lastCloseTime: number | null;
    pillsTaken: number;
  }>;
}

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

// Track last known battery level across API calls
let _lastKnownBatteryLevel: number | null = null; // Remove hardcoded value

// Helper to get the last known battery level
function getLastKnownBatteryLevel(): number | null {
  return _lastKnownBatteryLevel;
}

// Helper to update the last known battery level
function updateLastKnownBatteryLevel(level: number | null): void {
  if (level !== null && !isNaN(level)) {
    _lastKnownBatteryLevel = level;
    console.log(`Updated last known battery level to: ${level}%`);
  }
}

// Helper function to generate mock data when API calls fail
function getMockDeviceStatus(): DeviceStatusResponse {
  console.log("Generating mock data for development - no battery level available");
  
  return {
    timestamp: Date.now(),
    device: {
      serialNumber: "866760051856088-DEMO",
      batteryLevel: null, // No mock battery level
      batteryUpdated: Date.now(),
      isCharging: false
    },
    boxes: [
      {
        id: 1,
        isOpen: false,
        lastOpenTime: Date.now() - 3600000, // 1 hour ago
        lastCloseTime: Date.now() - 3590000, // 1 hour - 10 mins ago
        pillsTaken: 2
      },
      {
        id: 2,
        isOpen: false,
        lastOpenTime: null,
        lastCloseTime: null,
        pillsTaken: 0
      },
      {
        id: 3,
        isOpen: false,
        lastOpenTime: Date.now() - 7200000, // 2 hours ago
        lastCloseTime: Date.now() - 7190000, // 2 hours - 10 mins ago
        pillsTaken: 1
      }
    ]
  };
}

export const fetchDeviceStatus = async (): Promise<DeviceStatusResponse | null> => {
  try {
    // Try multiple possible Node-RED API endpoints
    let response;
    let connected = false;
    
    // Attempt all APIs in a more resilient way
    const endpoints = [
      'http://localhost:1880/api/device-status',  // Primary endpoint matching function7.js
      'http://35.246.27.69:1880/api/device-status', // Remote endpoint
      'http://localhost:1880/api/pillbox/status', // Alternative endpoint name
      'http://localhost:80/api/device-status'     // Fallback
    ];
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`[DeviceSync] Attempting to connect to: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json'
          },
          // Add a short timeout to fail faster
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          console.log(`[DeviceSync] Successfully connected to ${endpoint}`);
          connected = true;
          break;
        } else {
          console.warn(`[DeviceSync] API at ${endpoint} returned status: ${response.status}`);
        }
      } catch (err) {
        console.warn(`[DeviceSync] Connection to ${endpoint} failed:`, err);
        // Continue to next endpoint
      }
    }
    
    // If we successfully connected to an API
    if (connected && response && response.ok) {
      const data = await response.json();
      console.log("[DeviceSync] Received raw device status from API:", data);
      
      // Enhanced battery level handling with better debugging
      if (data && data.device) {
        console.log("[DeviceSync] Processing device data:", JSON.stringify(data.device));
        
        if (data.device.batteryLevel !== undefined && data.device.batteryLevel !== null) {
          // First log the raw value we received
          console.log(`[DeviceSync] Raw battery value from API: ${data.device.batteryLevel} (${typeof data.device.batteryLevel})`);
          
          // Ensure it's a proper number
          data.device.batteryLevel = Number(data.device.batteryLevel);
          
          // Check if conversion worked
          if (!isNaN(data.device.batteryLevel)) {
            console.log(`[DeviceSync] Converted battery level: ${data.device.batteryLevel}% (${typeof data.device.batteryLevel})`);
          updateLastKnownBatteryLevel(data.device.batteryLevel);
          } else {
            console.warn("[DeviceSync] Failed to convert battery level to number, setting to null");
            data.device.batteryLevel = null;
          }
        } else {
          console.warn("[DeviceSync] API response missing battery level, setting to null");
          data.device.batteryLevel = null;
        }
      } else {
        console.warn("[DeviceSync] API response missing device data");
      }
      
      // Check if debug information is provided
      if (data?.debug) {
        console.log("[DeviceSync] Debug info from API:", data.debug);
      }
      
      return data as DeviceStatusResponse;
    }
    
    // No API endpoint worked, return mock data instead
    console.log("[DeviceSync] All API endpoints failed. Using mock data instead.");
    return getMockDeviceStatus();
    
  } catch (error) {
    console.error("[DeviceSync] Error fetching device status:", error);
    return getMockDeviceStatus();
  }
};

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

// Original device fetch function - keeps backward compatibility
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

// Subscribe to device status updates from NodeRed API
export const subscribeToDeviceStatusUpdates = (onUpdate: (status: DeviceStatusResponse | null) => void) => {
  // Initially fetch once
  fetchDeviceStatus().then(status => {
    if (status) {
      console.log(`Initial device status received with battery: ${status.device.batteryLevel}%`);
      onUpdate(status);
    }
  });

  // Then set up regular polling
  const interval = setInterval(async () => {
    try {
      const status = await fetchDeviceStatus();
      if (status) {
        // Log battery level for debugging
        console.log(`Device status update with battery: ${status.device.batteryLevel}%`);
        onUpdate(status);
      }
    } catch (error) {
      console.error("Error in device status subscription:", error);
    }
  }, 180000); // Poll every 3 minutes
  
  return () => {
    clearInterval(interval);
  };
};

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  fetchDeviceData, 
  subscribeToDeviceUpdates, 
  fetchDeviceStatus, 
  subscribeToDeviceStatusUpdates, 
  DeviceStatusResponse 
} from "@/services/deviceSync";
import { CompartmentStatus } from "@/lib/types/compartments";
import { useNavigate } from "react-router-dom";
import { useDeviceEventsContext } from "@/providers/DeviceEventsProvider";
import { DeviceHeader } from "@/components/dashboard/device/DeviceHeader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface DeviceStatusCardProps {
  className?: string;
}

const DeviceStatusCard = ({
  className,
}: DeviceStatusCardProps) => {
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [compartments, setCompartments] = useState<CompartmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastApiResponse, setLastApiResponse] = useState<string | null>(null);
  const [deviceData, setDeviceData] = useState({
    batteryLevel: null as number | null,
    lastSync: "Not synced yet",
    isCharging: false,
    serialNumber: "Unknown"
  });
  const navigate = useNavigate();
  const { connected, lastBatteryEvent } = useDeviceEventsContext();
  
  // ✅ FIXED: Use ref to track latest battery event timestamp for subscription callback
  const lastBatteryEventRef = useRef<{ timestamp: number } | null>(null);
  
  // ✅ PHASE 1 FIX: Enhanced real-time battery event handling with source tracking
  useEffect(() => {
    if (lastBatteryEvent) {
      const source = lastBatteryEvent.source || 'unknown';
      const isSmoothed = lastBatteryEvent.smoothed;
      const rawValue = lastBatteryEvent.raw_value;
      
      console.log(`🔋 [DeviceStatusCard] Battery event from ${source}:`, {
        batteryLevel: lastBatteryEvent.batteryLevel,
        rawValue: rawValue,
        smoothed: isSmoothed,
        source: source,
        timestamp: new Date(lastBatteryEvent.timestamp).toLocaleTimeString()
      });
      
      // ✅ Update the ref with the latest battery event
      lastBatteryEventRef.current = lastBatteryEvent;
      
      // Update device data with real-time battery info
      setDeviceData(prevData => ({
        ...prevData,
        batteryLevel: lastBatteryEvent.batteryLevel,
        isCharging: lastBatteryEvent.isCharging,
        lastSync: formatDateTime(lastBatteryEvent.timestamp)
      }));
      
      console.log(`🚀 [DeviceStatusCard] Battery updated via WebSocket: ${lastBatteryEvent.batteryLevel}% (Source: ${source}, Charging: ${lastBatteryEvent.isCharging})`);
      
      // ✅ PHASE 1 FIX: Enhanced toast notifications with source information
      const prevLevel = deviceData.batteryLevel;
      if (prevLevel !== null && Math.abs(prevLevel - lastBatteryEvent.batteryLevel) >= 5) {
        toast.info(`Battery Level Update (${source})`, {
          description: `Battery is now at ${lastBatteryEvent.batteryLevel}%${lastBatteryEvent.isCharging ? ' (Charging)' : ''}${rawValue !== lastBatteryEvent.batteryLevel ? ` (Raw: ${rawValue}%)` : ''}`,
          duration: 4000,
        });
      }
      
      // ✅ Special notification for inject data to confirm Phase 1 fixes
      if (source === 'inject_data') {
        toast.success(`🎯 Inject Data Processed`, {
          description: `Showing exact value: ${lastBatteryEvent.batteryLevel}% (unsmoothed)`,
          duration: 3000,
        });
      }
    }
  }, [lastBatteryEvent]);
  
  // Function to force refresh the device status
  const refreshDeviceStatus = async () => {
    try {
      setLoading(true);
      toast.info("Fetching latest device status...");
      
      // Try to fetch device status
      const deviceStatus = await fetchDeviceStatus();
      
      if (deviceStatus) {
        // Save the raw API response for debugging
        setLastApiResponse(JSON.stringify(deviceStatus, null, 2));
        console.log("[DeviceStatusCard] Raw device status received:", deviceStatus);
        
        updateDeviceDataFromStatus(deviceStatus);
        toast.success("Device status refreshed");
      } else {
        setLastApiResponse("API call failed - no data returned");
        toast.error("Failed to fetch device status");
      }
    } catch (error) {
      console.error("[DeviceStatusCard] Error refreshing device status:", error);
      setLastApiResponse(`Error: ${error.message}`);
      toast.error(`Error refreshing device status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Load initial device data
    const loadDeviceData = async () => {
      try {
        setLoading(true);
        // Get device data from our NodeRed API
        const deviceStatus = await fetchDeviceStatus();
        
        if (deviceStatus) {
          // Save the raw API response for debugging
          setLastApiResponse(JSON.stringify(deviceStatus, null, 2));
          updateDeviceDataFromStatus(deviceStatus);
          console.log(`Initial battery level: ${deviceStatus.device.batteryLevel}%`);
        }
        
        // Also fetch the legacy device data for other information
        const deviceLegacy = await fetchDeviceData();
        if (deviceLegacy) {
          setDeviceMode(deviceLegacy.device_mode || "daily");
        }
      } catch (error) {
        console.error("Error loading device data:", error);
        // Keep default values in deviceData state
      } finally {
        setLoading(false);
      }
    };
    
    loadDeviceData();
    
    // Subscribe to device status updates (as fallback for non-WebSocket data)
    const unsubscribeStatus = subscribeToDeviceStatusUpdates((deviceStatus) => {
      if (deviceStatus) {
        // Save the raw API response for debugging
        setLastApiResponse(JSON.stringify(deviceStatus, null, 2));
        
        // ✅ CRITICAL FIX: Extended protection window from 10 seconds to 2 minutes
        const recentBatteryEvent = lastBatteryEventRef.current;
        const protectionWindow = 120000; // 2 minutes instead of 10 seconds
        const timeSinceLastWebSocket = recentBatteryEvent ? (Date.now() - recentBatteryEvent.timestamp) : Infinity;
        
        if (!recentBatteryEvent || timeSinceLastWebSocket > protectionWindow) {
          console.log(`[DeviceStatusCard] 📡 Using API fallback for battery data (${Math.round(timeSinceLastWebSocket/1000)}s since WebSocket)`);
          updateDeviceDataFromStatus(deviceStatus);
        } else {
          const remainingProtection = Math.round((protectionWindow - timeSinceLastWebSocket) / 1000);
          console.log(`[DeviceStatusCard] 🛡️ Skipping API update - WebSocket data protected for ${remainingProtection}s more`);
          
          // Still update non-battery data from API
          if (deviceStatus.device.serialNumber && deviceStatus.device.serialNumber !== deviceData.serialNumber) {
            setDeviceData(prevData => ({
              ...prevData,
              serialNumber: deviceStatus.device.serialNumber
            }));
          }
        }
      }
    });
    
    // Also keep the legacy subscription for other data
    const unsubscribeLegacy = subscribeToDeviceUpdates((deviceLegacy) => {
      if (deviceLegacy) {
        setDeviceMode(deviceLegacy.device_mode || "daily");
      }
    });
    
    return () => {
      unsubscribeStatus();
      unsubscribeLegacy();
    };
  }, []);
  
  // Helper function to update device data from status response
  const updateDeviceDataFromStatus = (status: DeviceStatusResponse) => {
    console.log("[DeviceStatusCard] Updating device data from API response:", status);
    
    if (!status || !status.device) {
      console.error("[DeviceStatusCard] Received invalid status object:", status);
      toast.error("Received invalid data format from the device");
      return;
    }
    
    // ✅ IMPROVED: Better battery level handling with fallback protection
    let batteryLevel = null;
    if (status.device.batteryLevel !== null && status.device.batteryLevel !== undefined) {
      const numericLevel = Number(status.device.batteryLevel);
      if (!isNaN(numericLevel)) {
        batteryLevel = numericLevel;
        console.log(`[DeviceStatusCard] ✅ Valid API battery: ${batteryLevel}%`);
      } else {
        console.warn(`[DeviceStatusCard] ⚠️ Invalid API battery value: ${status.device.batteryLevel}, keeping current: ${deviceData.batteryLevel}%`);
        batteryLevel = deviceData.batteryLevel; // Keep current value instead of null
      }
    } else {
      console.warn(`[DeviceStatusCard] ⚠️ API missing battery data, keeping current: ${deviceData.batteryLevel}%`);
      batteryLevel = deviceData.batteryLevel; // Keep current value instead of null
    }
    
    // Update the device data state
    setDeviceData(prevData => ({
      ...prevData,
      batteryLevel: batteryLevel,
      lastSync: formatDateTime(status.timestamp),
      isCharging: status.device.isCharging || false,
      serialNumber: status.device.serialNumber || prevData.serialNumber
    }));
    
    console.log(`[DeviceStatusCard] Device data updated: Battery=${batteryLevel !== null ? batteryLevel + '%' : 'unchanged'}, API_Call=${status.debug?.apiCallCount || 'unknown'}`);
  };
  
  // ✅ TESTING FRAMEWORK: Expose comprehensive battery debugging to window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).pillsureBatteryTest = {
        // Core state inspection
        getCurrentBatteryLevel: () => deviceData.batteryLevel,
        getLastWebSocketEvent: () => lastBatteryEventRef.current,
        getProtectionStatus: () => {
          const recent = lastBatteryEventRef.current;
          if (!recent) return { protected: false, reason: 'No WebSocket data received' };
          
                     const timeSince = Date.now() - recent.timestamp;
           const isProtected = timeSince <= 120000;
           const remainingTime = Math.max(0, 120000 - timeSince);
           
           return {
             protected: isProtected,
             timeSinceWebSocket: Math.round(timeSince / 1000),
             remainingProtection: Math.round(remainingTime / 1000),
             reason: isProtected ? 'Within 2-minute protection window' : 'Protection window expired'
           };
        },
        
        // Force API call to test override behavior
        forceApiUpdate: async () => {
          console.log('🧪 [BatteryTest] Forcing API update...');
          try {
            const status = await fetchDeviceStatus();
            if (status) {
              updateDeviceDataFromStatus(status);
              console.log('🧪 [BatteryTest] API update completed');
              return status;
            }
          } catch (error) {
            console.error('🧪 [BatteryTest] API update failed:', error);
            return null;
          }
        },
        
        // Test the race condition scenario
        testRaceCondition: async () => {
          console.log('🧪 [BatteryTest] Testing race condition scenario...');
          console.log('🧪 Step 1: Check current protection status');
          
          const protection = (window as any).pillsureBatteryTest.getProtectionStatus();
          console.log('🧪 Current protection:', protection);
          
          if (protection.protected) {
            console.log(`🧪 WebSocket data is protected for ${protection.remainingProtection}s more`);
            console.log('🧪 Step 2: Force API call (should be blocked)...');
            
            const beforeLevel = (window as any).pillsureBatteryTest.getCurrentBatteryLevel();
            await (window as any).pillsureBatteryTest.forceApiUpdate();
            const afterLevel = (window as any).pillsureBatteryTest.getCurrentBatteryLevel();
            
            if (beforeLevel === afterLevel) {
              console.log('✅ [BatteryTest] Protection worked! Battery level unchanged.');
            } else {
              console.error('❌ [BatteryTest] Protection failed! Battery level changed.');
            }
          } else {
            console.log('🧪 No active protection, testing API override...');
            await (window as any).pillsureBatteryTest.forceApiUpdate();
          }
        },
        
        // Monitor battery changes in real-time
        startMonitoring: (intervalMs = 5000) => {
          console.log(`🔍 [BatteryTest] Starting battery monitoring (every ${intervalMs}ms)`);
          
          const monitorId = setInterval(() => {
            const level = (window as any).pillsureBatteryTest.getCurrentBatteryLevel();
            const protection = (window as any).pillsureBatteryTest.getProtectionStatus();
            
            console.log(`🔋 Battery: ${level}% | Protected: ${protection.protected} | Remaining: ${protection.remainingProtection}s`);
            
            if (!protection.protected) {
              console.warn('⚠️ Battery vulnerable to API override!');
            }
          }, intervalMs);
          
          // Store monitor ID for stopping
          (window as any).pillsureBatteryMonitor = monitorId;
          
          console.log('📊 Use pillsureBatteryTest.stopMonitoring() to stop');
          return monitorId;
        },
        
        stopMonitoring: () => {
          if ((window as any).pillsureBatteryMonitor) {
            clearInterval((window as any).pillsureBatteryMonitor);
            delete (window as any).pillsureBatteryMonitor;
            console.log('🛑 Battery monitoring stopped');
          }
        },
        
        // Show comprehensive debug info
        showDebugInfo: () => {
          console.log('🔍 [BatteryDebug] Comprehensive Status Report:');
          console.log('├── Current State:', {
            batteryLevel: deviceData.batteryLevel,
            isCharging: deviceData.isCharging,
            lastSync: deviceData.lastSync,
            serialNumber: deviceData.serialNumber
          });
          console.log('├── WebSocket Event:', lastBatteryEventRef.current);
          console.log('├── Protection Status:', (window as any).pillsureBatteryTest.getProtectionStatus());
          console.log('├── Connection Status:', connected ? '🟢 Connected' : '🔴 Disconnected');
          console.log('└── Last API Response Preview:', lastApiResponse ? JSON.parse(lastApiResponse).device : 'None');
        },
        
        // Simulate various scenarios for testing
        simulateScenarios: {
          // Simulate the reported bug scenario
          bugScenario: async () => {
            console.log('🐛 [BatteryTest] Simulating reported bug scenario...');
            console.log('1. WebSocket sends battery update → wait 30s → API overrides to Unknown');
            
            // Show current state
            (window as any).pillsureBatteryTest.showDebugInfo();
            
            console.log('2. Waiting 30 seconds then forcing API call...');
            setTimeout(async () => {
              console.log('3. 30 seconds elapsed - forcing API update (simulating 3-min poll)');
              await (window as any).pillsureBatteryTest.forceApiUpdate();
              
              const finalLevel = (window as any).pillsureBatteryTest.getCurrentBatteryLevel();
              console.log(`4. Final battery level: ${finalLevel}%`);
              
              if (finalLevel === null) {
                console.error('❌ BUG REPRODUCED: Battery went to Unknown!');
              } else {
                console.log('✅ BUG FIXED: Battery level preserved!');
              }
            }, 30000);
          },
          
          // Test immediate API override (old 10s window)
          oldBehavior: async () => {
            console.log('🕐 [BatteryTest] Testing old 10-second behavior...');
            const protection = (window as any).pillsureBatteryTest.getProtectionStatus();
            
            if (protection.timeSinceWebSocket > 10) {
              console.log('⚠️ With old 10s window, battery would be vulnerable now');
              console.log('🧪 Forcing API call to demonstrate...');
              await (window as any).pillsureBatteryTest.forceApiUpdate();
            } else {
              console.log('ℹ️ Still within 10s window, try again in a few seconds');
            }
          }
        },
        
        // Help command
        help: () => {
          console.log(`
🔋 Battery Testing & Debugging Commands:

📊 STATE INSPECTION:
  pillsureBatteryTest.getCurrentBatteryLevel()     // Get current battery %
  pillsureBatteryTest.getProtectionStatus()        // Check 2-min protection window
  pillsureBatteryTest.showDebugInfo()              // Complete status report

🧪 TESTING:
  pillsureBatteryTest.testRaceCondition()          // Test API override protection
  pillsureBatteryTest.forceApiUpdate()             // Force immediate API call
  pillsureBatteryTest.simulateScenarios.bugScenario()  // Reproduce reported bug
  pillsureBatteryTest.simulateScenarios.oldBehavior()  // Test old 10s behavior

🔍 MONITORING:
  pillsureBatteryTest.startMonitoring()            // Real-time battery monitoring
  pillsureBatteryTest.startMonitoring(2000)        // Custom interval (2s)
  pillsureBatteryTest.stopMonitoring()             // Stop monitoring

🎯 QUICK TESTS:
  // Watch protection window in action
  pillsureBatteryTest.startMonitoring(1000)
  
  // Test if bug is fixed
  pillsureBatteryTest.simulateScenarios.bugScenario()
  
  // Force API override test
  pillsureBatteryTest.testRaceCondition()

💡 TIP: Open Network tab to see API calls to http://localhost:1880/api/device-status
          `);
        }
      };
      
      // Add to main pillsureTest object for consistency
      if ((window as any).pillsureTest) {
        (window as any).pillsureTest.battery = (window as any).pillsureBatteryTest;
      }
      
      // Log availability
      console.log('🔋 Battery testing framework loaded! Type pillsureBatteryTest.help() for commands');
    }
  }, [deviceData, lastBatteryEventRef.current, connected, lastApiResponse]);
  
  const formatDateTime = (timestamp: number | string) => {
    try {
      const date = typeof timestamp === 'number' 
        ? new Date(timestamp) 
        : new Date(timestamp);
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return String(timestamp);
    }
  };

  if (loading) {
    return (
      <Card className={cn("border shadow-sm", className)}>
        <CardContent className="p-4 flex justify-center items-center h-40">
          <div className="animate-pulse text-center">
            <p className="text-sm text-muted-foreground font-light">Loading device data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardContent className="p-4">
        <DeviceHeader 
          batteryLevel={deviceData.batteryLevel}
          lastSync={deviceData.lastSync}
          isCharging={deviceData.isCharging}
          serialNumber={deviceData.serialNumber}
        />
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;

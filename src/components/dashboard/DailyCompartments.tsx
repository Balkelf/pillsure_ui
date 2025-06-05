import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SunMedium, Moon, Info, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDeviceEvents, DEVICE_EVENTS } from "@/hooks/use-device-events";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

// Device Event Constants
// const DEVICE_EVENTS = { ... } - REMOVED

enum MedicationStatus {
  PENDING = "pending",
  TAKEN = "taken",
  MISSED = "missed"
}

// Component to render status-based icons with animations
const MedicationStatusIcon = ({ status, className }: { status: MedicationStatus; className?: string }) => {
  // Animation variants for different states
  const iconVariants = {
    pending: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    taken: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      opacity: 1,
      transition: { 
        scale: { duration: 0.5, ease: "easeInOut" },
        rotate: { duration: 0.6, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    },
    missed: {
      scale: [1, 1.1, 1],
      rotate: [0, -10, 10, 0],
      opacity: 1,
      transition: { 
        scale: { duration: 0.4, ease: "easeInOut" },
        rotate: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };

  const getAnimationKey = () => {
    switch (status) {
      case MedicationStatus.TAKEN: return "taken";
      case MedicationStatus.MISSED: return "missed";
      case MedicationStatus.PENDING:
      default: return "pending";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        className={cn("flex items-center justify-center", className)}
        variants={iconVariants}
        initial="pending"
        animate={getAnimationKey()}
        exit="pending"
      >
        {status === MedicationStatus.TAKEN && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
              <Check className="h-6 w-6 text-green-600 stroke-[3]" />
            </div>
          </motion.div>
        )}
        {status === MedicationStatus.MISSED && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
              <X className="h-6 w-6 text-red-600 stroke-[3]" />
            </div>
          </motion.div>
        )}
        {status === MedicationStatus.PENDING && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
              <Check className="h-6 w-6 text-gray-400 stroke-[3]" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Function to get styling for medication status buttons
const getMedicationStatusStyles = (status: MedicationStatus) => {
  switch (status) {
    case MedicationStatus.TAKEN:
      return "hover:bg-green-50 transition-colors duration-200";
    case MedicationStatus.MISSED:
      return "hover:bg-red-50 transition-colors duration-200";
    case MedicationStatus.PENDING:
    default:
      return "hover:bg-gray-50 transition-colors duration-200";
  }
};

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  status: MedicationStatus;
  compartmentId?: number; // Map to physical device compartment
  lastUpdated?: Date;
}

interface Compartment {
  id: number;
  name: "Morning" | "Lunch" | "Evening";
  medications: Medication[];
}

interface DailyCompartmentsProps {
  className?: string;
  websocketUrl?: string; // Optional WebSocket URL for device connection
  devMode?: boolean; // Disable device connection for development
}

const DailyCompartments = ({ 
  className, 
  websocketUrl = "ws://localhost:1880/ws/pillsure",
  devMode = true // Default to dev mode to prevent connection errors during development
}: DailyCompartmentsProps) => {
  // Device connection for real-time updates (only if not in dev mode)
  const deviceEvents = useDeviceEvents(devMode ? "" : websocketUrl);

  // Screen reader announcement state
  const [announcement, setAnnouncement] = useState("");

  // Example data - in a real app, this would come from a backend or parent component
  const [compartments, setCompartments] = useState<Compartment[]>([
    {
      id: 1,
      name: "Morning",
      medications: [
        {
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          time: "8:00 AM",
          instructions: "Take with breakfast to reduce stomach upset. Initially 500 mg once daily for at least 1 week, dose to be taken with breakfast.",
          status: MedicationStatus.TAKEN,
          compartmentId: 1,
          lastUpdated: new Date(),
        },
      ],
    },
    {
      id: 2,
      name: "Lunch",
      medications: [
        {
          id: 2,
          name: "Metformin",
          dosage: "500mg",
          time: "1:00 PM",
          instructions: "Take with lunch to reduce stomach upset. Then 500 mg twice daily for at least 1 week, dose to be taken with lunch.",
          status: MedicationStatus.PENDING,
          compartmentId: 2,
        },
      ],
    },
    {
      id: 3,
      name: "Evening",
      medications: [
        {
          id: 3,
          name: "Metformin",
          dosage: "500mg",
          time: "7:00 PM",
          instructions: "Take with dinner to reduce stomach upset. Then 500 mg 3 times a day, dose to be taken with dinner.",
          status: MedicationStatus.MISSED,
          compartmentId: 3,
        },
      ],
    },
  ]);

  const getCompartmentIcon = (name: string) => {
    switch (name) {
      case "Morning":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7.5V10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.92993 10.9297L6.33993 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 18H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 18H22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.0699 10.9297L17.6599 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 22H2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 18C16 16.9391 15.5786 15.9217 14.8284 15.1716C14.0783 14.4214 13.0609 14 12 14C10.9391 14 9.92172 14.4214 9.17157 15.1716C8.42143 15.9217 8 16.9391 8 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "Lunch":
        return <SunMedium className="h-10 w-10 text-black" />;
      case "Evening":
        return <Moon className="h-10 w-10 text-black" />;
      default:
        return <SunMedium className="h-10 w-10 text-black" />;
    }
  };

  // Update medication status with history tracking and notifications
  const updateMedicationStatus = (
    compartmentId: number, 
    medicationId: number, 
    newStatus: MedicationStatus,
    source: 'manual' | 'device' = 'manual'
  ) => {
    // Find the medication to get its current state and name
    const compartment = compartments.find(c => c.id === compartmentId);
    const medication = compartment?.medications.find(m => m.id === medicationId);
    
    if (!medication || !compartment) {
      toast.error("Medication not found");
      return;
    }

    const oldStatus = medication.status;
    
    // Update the state
    setCompartments(
      compartments.map((compartment) => {
        if (compartment.id === compartmentId) {
          return {
            ...compartment,
            medications: compartment.medications.map((medication) => {
              if (medication.id === medicationId) {
                return { 
                  ...medication, 
                  status: newStatus,
                  lastUpdated: new Date()
                };
              }
              return medication;
            }),
          };
        }
        return compartment;
      })
    );

    // Show appropriate toast notification
    const medicationName = medication.name;
    const compartmentName = compartment.name;
    const sourceIcon = source === 'device' ? '📱' : '👤';
    
    // Screen reader announcement
    const announcement = `${medicationName} ${compartmentName} medication status changed to ${newStatus}`;
    setAnnouncement(announcement);
    
    // Clear announcement after a short delay
    setTimeout(() => setAnnouncement(""), 3000);
    
    switch (newStatus) {
      case MedicationStatus.TAKEN:
        toast.success(
          `${sourceIcon} ${medicationName} marked as taken (${compartmentName})`,
          {
            description: source === 'device' 
              ? 'Automatically detected by device' 
              : 'Manually updated',
            duration: 3000,
          }
        );
        break;
      case MedicationStatus.MISSED:
        toast.error(
          `${sourceIcon} ${medicationName} marked as missed (${compartmentName})`,
          {
            description: source === 'device' 
              ? 'Automatically detected by device' 
              : 'Manually updated',
            duration: 4000,
          }
        );
        break;
      case MedicationStatus.PENDING:
        toast.info(
          `${sourceIcon} ${medicationName} reset to pending (${compartmentName})`,
          {
            description: 'Status has been reset',
            duration: 2000,
          }
        );
        break;
    }
  };

  // Manual status cycling for user interaction
  const cycleMedicationStatus = (compartmentId: number, medicationId: number) => {
    const compartment = compartments.find(c => c.id === compartmentId);
    const medication = compartment?.medications.find(m => m.id === medicationId);
    
    if (!medication) return;
    
    // Cycle through states: PENDING → TAKEN → MISSED → PENDING
    let nextStatus: MedicationStatus;
    switch (medication.status) {
      case MedicationStatus.PENDING:
        nextStatus = MedicationStatus.TAKEN;
        break;
      case MedicationStatus.TAKEN:
        nextStatus = MedicationStatus.MISSED;
        break;
      case MedicationStatus.MISSED:
        nextStatus = MedicationStatus.PENDING;
        break;
      default:
        nextStatus = MedicationStatus.PENDING;
    }
    
    updateMedicationStatus(compartmentId, medicationId, nextStatus, 'manual');
  };

  // 🕐 Time-based status logic
  const MISS_BUFFER_MINUTES = 30; // Grace period before marking as missed

  // Parse time string to today's Date object
  const parseTimeToToday = (timeStr: string): Date => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : 
                         period === 'AM' && hours === 12 ? 0 : hours;
    
    const today = new Date();
    today.setHours(adjustedHours, minutes, 0, 0);
    return today;
  };

  // Check if medication should be auto-marked as missed
  const shouldAutoMiss = (medication: Medication): boolean => {
    if (medication.status !== MedicationStatus.PENDING) return false;
    
    const scheduledTime = parseTimeToToday(medication.time);
    const missTime = new Date(scheduledTime.getTime() + MISS_BUFFER_MINUTES * 60 * 1000);
    const now = new Date();
    
    return now > missTime;
  };

  // Get time remaining until auto-miss (in minutes)
  const getTimeUntilAutoMiss = (medication: Medication): number => {
    if (medication.status !== MedicationStatus.PENDING) return 0;
    
    const scheduledTime = parseTimeToToday(medication.time);
    const missTime = new Date(scheduledTime.getTime() + MISS_BUFFER_MINUTES * 60 * 1000);
    const now = new Date();
    
    const remainingMs = missTime.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
  };

  // Format time remaining for display
  const formatTimeRemaining = (minutes: number): string => {
    if (minutes <= 0) return "Overdue";
    if (minutes < 60) return `${minutes}m remaining`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m remaining`;
  };

  // Auto-miss checker effect
  useEffect(() => {
    const checkAutoMiss = () => {
      compartments.forEach(compartment => {
        compartment.medications.forEach(medication => {
          if (shouldAutoMiss(medication)) {
            console.log(`⏰ Auto-marking ${medication.name} as missed (${compartment.name})`);
            updateMedicationStatus(compartment.id, medication.id, MedicationStatus.MISSED, 'device');
          }
        });
      });
    };

    // Check immediately and then every minute
    checkAutoMiss();
    const interval = setInterval(checkAutoMiss, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [compartments]);

  // 🔄 Real-time device event processing
  useEffect(() => {
    if (deviceEvents.lastPillEvent) {
      const { eventName, compartmentId, eventCode, timestamp } = deviceEvents.lastPillEvent;
      
      // Find the medication for this compartment
      const compartment = compartments.find(c => c.id === compartmentId);
      const medication = compartment?.medications.find(m => m.compartmentId === compartmentId);
      
      if (!medication || !compartment) {
        console.warn(`🚫 No medication found for compartment ${compartmentId} from device event`);
        return;
      }

      // Process pill-specific events
      if (eventName === 'PILL_TAKE_EVENT') {
        console.log(`🎯 Device: Pill taken from compartment ${compartmentId} (${compartment.name})`);
        updateMedicationStatus(compartment.id, medication.id, MedicationStatus.TAKEN, 'device');
      } else if (eventName === 'PILL_MISS_EVENT') {
        console.log(`⏰ Device: Pill missed in compartment ${compartmentId} (${compartment.name})`);
        updateMedicationStatus(compartment.id, medication.id, MedicationStatus.MISSED, 'device');
      } else if (eventName === 'LID_OPEN') {
        console.log(`📂 Device: Lid opened for compartment ${compartmentId} (${compartment.name})`);
        // Optionally handle lid open events (e.g., reset to pending if was missed)
      } else if (eventName === 'LID_CLOSE') {
        console.log(`📁 Device: Lid closed for compartment ${compartmentId} (${compartment.name})`);
        // Optionally handle lid close events
      }
    }
  }, [deviceEvents.lastPillEvent, compartments]);

  // Manual override with confirmation (for future enhancement)
  const manualOverride = (compartmentId: number, medicationId: number, targetStatus: MedicationStatus) => {
    const compartment = compartments.find(c => c.id === compartmentId);
    const medication = compartment?.medications.find(m => m.id === medicationId);
    
    if (!medication) return;
    
    // For now, directly update. In future, this could show a confirmation dialog
    updateMedicationStatus(compartmentId, medicationId, targetStatus, 'manual');
    
    // Audit trail logging
    console.log(`Manual override: ${medication.name} status changed from ${medication.status} to ${targetStatus}`);
  };

  // Get status transition tooltip text
  const getStatusTransitionText = (currentStatus: MedicationStatus) => {
    switch (currentStatus) {
      case MedicationStatus.PENDING:
        return "Click to mark as taken";
      case MedicationStatus.TAKEN:
        return "Click to mark as missed";
      case MedicationStatus.MISSED:
        return "Click to reset to pending";
      default:
        return "Click to change status";
    }
  };

  // 🧪 TEMPORARY: Expose testing functions to window for console testing
  // Remove this in production
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).pillsureTest = {
        // Device event simulation via WebSocket (for real device testing)
        simulatePillTaken: (compartmentId: number) => {
          console.log(`🧪 Testing: Simulating PILL_TAKE_EVENT for compartment ${compartmentId}`);
          // Send event through WebSocket if connected
          if (deviceEvents.connected) {
            deviceEvents.sendMessage({
              type: 'pillEvent',
              eventCode: DEVICE_EVENTS.PILL_TAKE_EVENT,
              compartmentId: compartmentId,
              timestamp: Date.now()
            });
          } else {
            console.warn('🚫 Device not connected - cannot send real event');
            // For testing when device is not connected, manually trigger the medication update
            const compartment = compartments.find(c => c.id === compartmentId);
            const medication = compartment?.medications.find(m => m.compartmentId === compartmentId);
            if (compartment && medication) {
              updateMedicationStatus(compartment.id, medication.id, MedicationStatus.TAKEN, 'device');
            }
          }
        },
        simulatePillMissed: (compartmentId: number) => {
          console.log(`🧪 Testing: Simulating PILL_MISS_EVENT for compartment ${compartmentId}`);
          // Send event through WebSocket if connected
          if (deviceEvents.connected) {
            deviceEvents.sendMessage({
              type: 'pillEvent',
              eventCode: DEVICE_EVENTS.PILL_MISS_EVENT,
              compartmentId: compartmentId,
              timestamp: Date.now()
            });
          } else {
            console.warn('🚫 Device not connected - cannot send real event');
            // For testing when device is not connected, manually trigger the medication update
            const compartment = compartments.find(c => c.id === compartmentId);
            const medication = compartment?.medications.find(m => m.compartmentId === compartmentId);
            if (compartment && medication) {
              updateMedicationStatus(compartment.id, medication.id, MedicationStatus.MISSED, 'device');
            }
          }
        },
        // Direct function access - removed handleDeviceEvent reference
        // Utility functions
        getCompartments: () => compartments,
        getDeviceStatus: () => deviceEvents.connectionStatus,
        isDeviceConnected: () => deviceEvents.connected,
        resetToDefaults: () => {
          setCompartments([
            {
              id: 1,
              name: "Morning",
              medications: [{
                id: 1,
                name: "Metformin",
                dosage: "500mg",
                time: "8:00 AM",
                instructions: "Take with breakfast to reduce stomach upset.",
                status: MedicationStatus.TAKEN,
                compartmentId: 1,
                lastUpdated: new Date(),
              }],
            },
            {
              id: 2,
              name: "Lunch",
              medications: [{
                id: 2,
                name: "Metformin",
                dosage: "500mg",
                time: "1:00 PM",
                instructions: "Take with lunch to reduce stomach upset.",
                status: MedicationStatus.PENDING,
                compartmentId: 2,
              }],
            },
            {
              id: 3,
              name: "Evening",
              medications: [{
                id: 3,
                name: "Metformin",
                dosage: "500mg",
                time: "7:00 PM",
                instructions: "Take with dinner to reduce stomach upset.",
                status: MedicationStatus.MISSED,
                compartmentId: 3,
              }],
            },
          ]);
        },
        // Test all scenarios
        runFullTest: () => {
          console.log('🧪 === RUNNING FULL PILLSURE TEST ===');
          console.log('1. Device connection status:', deviceEvents.connectionStatus);
          console.log('2. Current state:', compartments.map(c => ({
            compartment: c.name,
            status: c.medications[0]?.status
          })));
          
          setTimeout(() => {
            console.log('3. Taking pill from compartment 2 (Lunch)...');
            (window as any).pillsureTest.simulatePillTaken(2);
          }, 1000);
          
          setTimeout(() => {
            console.log('4. Missing pill from compartment 1 (Morning)...');
            (window as any).pillsureTest.simulatePillMissed(1);
          }, 2000);
          
          setTimeout(() => {
            console.log('5. Testing invalid compartment...');
            (window as any).pillsureTest.simulatePillTaken(99);
          }, 3000);
          
          setTimeout(() => {
            console.log('6. Final state:', compartments.map(c => ({
              compartment: c.name,
              status: c.medications[0]?.status
            })));
            console.log('🧪 === TEST COMPLETE ===');
          }, 4000);
        }
      };
      
      console.log('🧪 Pillsure testing interface loaded! Try these commands:');
      console.log(`🔧 Mode: ${devMode ? 'Development (Device connection disabled)' : 'Production (Device connection enabled)'}`);
      console.log('🎬 NEW: Enhanced with animations and toast notifications!');
      console.log('pillsureTest.simulatePillTaken(2)    // Take pill from compartment 2 (with animation)');
      console.log('pillsureTest.simulatePillMissed(1)   // Miss pill from compartment 1 (with animation)');
      console.log('pillsureTest.runFullTest()           // Run complete test sequence (watch the animations!)');
      console.log('pillsureTest.getCompartments()       // View current state');
      console.log('pillsureTest.getDeviceStatus()       // Check device connection');
      console.log('pillsureTest.isDeviceConnected()     // Quick connection check');
      console.log('pillsureTest.resetToDefaults()       // Reset to initial state');
      console.log('💡 Click the status buttons to see manual animations and toasts!');
      if (devMode) {
        console.log('💡 To enable real device connection, pass devMode={false} to component');
      }
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).pillsureTest;
      }
    };
  }, [compartments, deviceEvents]);

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Today</CardTitle>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground font-light">Compartments</p>
            </div>
          </div>
          
          {/* Device Status Indicator */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1">
                    <div 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        devMode 
                          ? "bg-blue-500" 
                          : deviceEvents.connected 
                            ? "bg-green-500" 
                            : "bg-red-500"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {devMode 
                        ? "Dev Mode" 
                        : deviceEvents.connected 
                          ? "Connected" 
                          : "Offline"
                      }
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <div className="space-y-1">
                    {devMode ? (
                      <>
                        <p className="text-xs font-medium">🔧 Development Mode</p>
                        <p className="text-xs text-muted-foreground">
                          Device connection disabled for testing
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Use pillsureTest.* commands to simulate events
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium">
                          {deviceEvents.connected ? "🟢 Device Connected" : "🔴 Device Offline"}
                        </p>
                        {deviceEvents.connectionStatus.lastSeen && (
                          <p className="text-xs text-muted-foreground">
                            Last seen: {deviceEvents.connectionStatus.lastSeen.toLocaleTimeString()}
                          </p>
                        )}
                        {!deviceEvents.connected && deviceEvents.connectionStatus.reconnectAttempts > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Reconnect attempts: {deviceEvents.connectionStatus.reconnectAttempts}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          WebSocket: {websocketUrl}
                        </p>
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          {compartments.map((compartment, index) => (
            <div key={compartment.id}>
              <div className="flex items-center py-2">
                <div className="flex-1 flex items-start">
                  <div className="flex flex-col items-center mr-6 w-16">
                    <div className="p-2">
                      {getCompartmentIcon(compartment.name)}
                    </div>
                    <span className="text-xs mt-1">{compartment.name}</span>
                  </div>

                  <div className="flex-1">
                    {compartment.medications.map((medication) => (
                      <div key={medication.id} className="space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{medication.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {medication.dosage}
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                  <Info className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p className="text-xs">{medication.instructions}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-xs text-muted-foreground font-light">
                          {medication.time}
                          {medication.status === MedicationStatus.PENDING && (
                            <span className="ml-2 text-orange-500">
                              ({formatTimeRemaining(getTimeUntilAutoMiss(medication))})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                            getMedicationStatusStyles(compartment.medications[0]?.status)
                          )}
                          onClick={() => 
                            cycleMedicationStatus(compartment.id, compartment.medications[0]?.id)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              cycleMedicationStatus(compartment.id, compartment.medications[0]?.id);
                            }
                          }}
                          aria-label={`${compartment.medications[0]?.name} medication status: ${compartment.medications[0]?.status}. ${getStatusTransitionText(compartment.medications[0]?.status)}`}
                          aria-describedby={`medication-${compartment.medications[0]?.id}-description`}
                          role="button"
                          tabIndex={0}
                        >
                          <MedicationStatusIcon 
                            status={compartment.medications[0]?.status}
                            className="sr-only"
                          />
                          <span className="sr-only">
                            {compartment.medications[0]?.status === MedicationStatus.TAKEN && "Medication taken"}
                            {compartment.medications[0]?.status === MedicationStatus.MISSED && "Medication missed"}
                            {compartment.medications[0]?.status === MedicationStatus.PENDING && "Medication pending"}
                          </span>
                          <MedicationStatusIcon status={compartment.medications[0]?.status} />
                        </Button>
                        <div 
                          id={`medication-${compartment.medications[0]?.id}-description`}
                          className="sr-only"
                        >
                          {compartment.medications[0]?.name} {compartment.medications[0]?.dosage} scheduled for {compartment.medications[0]?.time} in {compartment.name} compartment. Current status: {compartment.medications[0]?.status}.
                          {compartment.medications[0]?.status === MedicationStatus.PENDING && 
                            ` Time remaining: ${formatTimeRemaining(getTimeUntilAutoMiss(compartment.medications[0]))}`
                          }
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{getStatusTransitionText(compartment.medications[0]?.status)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {index < compartments.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Screen reader live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>
    </Card>
  );
};

export default DailyCompartments;
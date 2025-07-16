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
import { NextMedicationTimerBar } from "./NextMedicationTimerBar";
import { useNextMedicationTimer } from "@/hooks/useNextMedicationTimer";
import { useMedicationPersistence } from "@/hooks/useMedicationPersistence";

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
  websocketUrl = "ws://localhost:1880/ws/events",
  devMode = false // Enable device connection for real device events
}: DailyCompartmentsProps) => {
  // Device connection for real-time updates (only if not in dev mode)
  const deviceEvents = useDeviceEvents(devMode ? "" : websocketUrl);

  // Medication persistence hook
  const { 
    persistMedicationStates, 
    loadPersistedMedicationStates, 
    clearPersistedStates,
    getLastSyncTime 
  } = useMedicationPersistence();

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

  // Initialize timer state for next medication
  const timerState = useNextMedicationTimer(compartments);

  // Load persisted medication states on component mount
  useEffect(() => {
    const persistedStates = loadPersistedMedicationStates();
    
    if (Object.keys(persistedStates).length > 0) {
      console.log('🔄 Restoring medication states from localStorage...');
      
      setCompartments(prevCompartments => {
        return prevCompartments.map(compartment => ({
          ...compartment,
          medications: compartment.medications.map(medication => {
            const key = `${compartment.id}-${medication.id}`;
            const persistedState = persistedStates[key];
            
            if (persistedState) {
              return {
                ...medication,
                status: persistedState.status as MedicationStatus,
                lastUpdated: persistedState.lastUpdated
              };
            }
            
            return medication;
          })
        }));
      });
      
      const lastSync = getLastSyncTime();
      if (lastSync) {
        console.log('📅 Last sync:', lastSync.toLocaleString());
      }
    }
  }, [loadPersistedMedicationStates, getLastSyncTime]);

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
    setCompartments(prevCompartments => {
      const updatedCompartments = prevCompartments.map((compartment) => {
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
      });

      // Persist the updated state immediately
      persistMedicationStates(updatedCompartments);
      
      return updatedCompartments;
    });

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

  // Get time remaining until auto-miss (in seconds)
  const getTimeUntilAutoMissSeconds = (medication: Medication): number => {
    if (medication.status !== MedicationStatus.PENDING) return 0;
    const scheduledTime = parseTimeToToday(medication.time);
    const missTime = new Date(scheduledTime.getTime() + MISS_BUFFER_MINUTES * 60 * 1000);
    const now = new Date();
    const remainingMs = missTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / 1000));
  };

  // Format time remaining for display (hh:mm or mm, only show seconds if < 1 min)
  const formatTimeRemainingNoSeconds = (seconds: number): string => {
    if (seconds <= 0) return "Overdue";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m remaining`;
    if (mins > 0) return `${mins}m remaining`;
    return `${secs}s remaining`;
  };

  // State for per-second update
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Reset all medications to pending for new day (RELOAD_EVENT)
  const resetAllMedicationsToNewDay = () => {
    console.log('🔄 Device: RELOAD_EVENT - Resetting all medications to new day');
    setCompartments(prevCompartments => {
      const updatedCompartments = prevCompartments.map(compartment => ({
        ...compartment,
        medications: compartment.medications.map(medication => ({
          ...medication,
          status: MedicationStatus.PENDING,
          lastUpdated: new Date()
        }))
      }));

      // Persist the reset state
      persistMedicationStates(updatedCompartments);
      
      return updatedCompartments;
    });
    
    toast.info('📅 New day started - All medications reset to pending', {
      description: 'Device detected a new day cycle',
      duration: 4000,
    });
  };

  // 🔄 Real-time device event processing
  useEffect(() => {
    if (deviceEvents.lastPillEvent) {
      const { eventName, compartmentId, eventCode, timestamp } = deviceEvents.lastPillEvent;
      
      // Handle RELOAD_EVENT (affects all compartments)
      if (eventName === 'RELOAD_EVENT') {
        resetAllMedicationsToNewDay();
        return;
      }
      
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
        simulatePending: (compartmentId: number) => {
          console.log(`🧪 Testing: Setting compartment ${compartmentId} to pending state`);
          const compartment = compartments.find(c => c.id === compartmentId);
          const medication = compartment?.medications.find(m => m.compartmentId === compartmentId);
          if (compartment && medication) {
            updateMedicationStatus(compartment.id, medication.id, MedicationStatus.PENDING, 'device');
          } else {
            console.warn(`⚠️ Compartment ${compartmentId} not found`);
          }
        },
        simulateAllPending: () => {
          console.log('🧪 Testing: Setting all compartments to pending state');
          compartments.forEach((compartment) => {
            const medication = compartment.medications[0];
            if (medication) {
              updateMedicationStatus(compartment.id, medication.id, MedicationStatus.PENDING, 'device');
            }
          });
          console.log('✅ All medications set to pending');
        },
        simulateReloadEvent: () => {
          console.log(`🧪 Testing: Simulating RELOAD_EVENT`);
          // Send event through WebSocket if connected
          if (deviceEvents.connected) {
            deviceEvents.sendMessage({
              type: 'pillEvent',
              eventCode: DEVICE_EVENTS.RELOAD_EVENT,
              compartmentId: 0,
              timestamp: Date.now()
            });
          } else {
            console.warn('🚫 Device not connected - cannot send real event');
            // For testing when device is not connected, manually trigger the reload
            resetAllMedicationsToNewDay();
          }
        },
        // Direct function access - removed handleDeviceEvent reference
        // Utility functions
        getCompartments: () => compartments,
        getDeviceStatus: () => deviceEvents.connectionStatus,
        isDeviceConnected: () => deviceEvents.connected,
        getTimerState: () => timerState,
        getNextMedication: () => timerState.nextMedication,
        // 🌙 Enhanced Timer Testing for Cross-Day Support
        testTimerPhases: () => {
          console.log('⏰ Testing ALL Timer Phases (including overnight)...');
          console.log('Current timer state:', timerState);
          
          console.log('Phase 1: Reset to pending state...');
          resetAllMedicationsToNewDay();
          
          setTimeout(() => {
            console.log('Phase 2: Take morning and lunch (green timer for evening)...');
            updateMedicationStatus(1, compartments[0]?.medications[0]?.id, MedicationStatus.TAKEN, 'device');
            updateMedicationStatus(2, compartments[1]?.medications[0]?.id, MedicationStatus.TAKEN, 'device');
          }, 2000);
          
          setTimeout(() => {
            console.log('Phase 3: Take evening (triggers BLUE overnight timer)...');
            updateMedicationStatus(3, compartments[2]?.medications[0]?.id, MedicationStatus.TAKEN, 'device');
            console.log('🌙 Overnight timer should now be visible with BLUE gradient!');
          }, 4000);
          
          console.log('📊 Watch the timer transition through phases over 6 seconds.');
        },
        
        // 🔵 Overnight Timer Specific Tests
        simulateOvernightTimer: () => {
          console.log('🌙 Forcing overnight timer scenario...');
          
          // Mark all medications as taken to trigger overnight timer
          compartments.forEach((compartment) => {
            const medication = compartment.medications[0];
            if (medication) {
              updateMedicationStatus(compartment.id, medication.id, MedicationStatus.TAKEN, 'device');
            }
          });
          
          console.log('✅ All medications marked as taken');
          console.log('🔵 Timer should show BLUE gradient with "Next medications begin in..." message');
          console.log('💡 Timer is counting down to tomorrow morning!');
        },
        
        testOvernightPhases: () => {
          console.log('🌙 Testing overnight timer phases...');
          
          // First simulate all taken
          (window as any).pillsureTest.simulateOvernightTimer();
          
          setTimeout(() => {
            console.log('🔍 Checking timer state after overnight activation...');
            console.log(`Next Medication: ${timerState.nextMedication?.name || 'None'}`);
            console.log(`Is Next Day: ${timerState.isNextDay}`);
            console.log(`Current Phase: ${timerState.currentPhase}`);
            
            if (timerState.isNextDay) {
              console.log('✅ Overnight timer successfully activated!');
              console.log('🔵 Should see blue gradient with moon/sunrise emojis');
            } else {
              console.log('❌ Overnight timer not activated - investigating...');
            }
          }, 1000);
        },
        
        showTimerDetails: () => {
          console.log('⏰ Detailed Timer State:');
          console.log(`➤ Next Medication: ${timerState.nextMedication?.name || 'None'}`);
          console.log(`➤ Timer Phase: ${timerState.currentPhase}`);
          console.log(`➤ Is Next Day: ${timerState.isNextDay ? '🌙 YES (Overnight)' : '☀️ NO (Same Day)'}`);
          console.log(`➤ Last Completed: ${timerState.lastCompletedMedication?.name || 'None'}`);
          
          if (timerState.timerStart && timerState.timerEnd) {
            const now = new Date();
            const progress = (now.getTime() - timerState.timerStart.getTime()) / 
                            (timerState.timerEnd.getTime() - timerState.timerStart.getTime());
            console.log(`➤ Progress: ${(progress * 100).toFixed(1)}%`);
            
            const timeLeft = timerState.timerEnd.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            console.log(`➤ Time Remaining: ${hours}hr ${minutes}min`);
          }
          
          if (timerState.isNextDay) {
            console.log('🔵 OVERNIGHT MODE: Blue gradient timer should be visible');
          }
        },

        // 💾 Persistence Testing Commands
        checkPersistedData: () => {
          console.log('💾 Checking localStorage data...');
          const persistedStates = loadPersistedMedicationStates();
          const lastSync = getLastSyncTime();
          
          console.log(`📊 Persisted medications: ${Object.keys(persistedStates).length}`);
          console.log('📋 Detailed states:', persistedStates);
          console.log(`📅 Last sync: ${lastSync ? lastSync.toLocaleString() : 'Never'}`);
          
          if (Object.keys(persistedStates).length === 0) {
            console.log('⚠️ No persisted data found - take a medication to see persistence in action');
          }
        },

        clearPersistedData: () => {
          console.log('🗑️ Clearing all persisted medication data...');
          clearPersistedStates();
          console.log('✅ Cleared! Refresh page to see medications reset to default state.');
        },

        testPersistence: () => {
          console.log('🧪 Testing persistence flow...');
          
          // Step 1: Check initial state
          console.log('Step 1: Checking initial state...');
          const initialStates = loadPersistedMedicationStates();
          console.log(`Initial persisted count: ${Object.keys(initialStates).length}`);
          
          // Step 2: Take morning medication
          console.log('Step 2: Taking morning medication...');
          updateMedicationStatus(1, compartments[0]?.medications[0]?.id, MedicationStatus.TAKEN, 'manual');
          
          setTimeout(() => {
            // Step 3: Check if it was persisted
            console.log('Step 3: Verifying persistence...');
            const afterStates = loadPersistedMedicationStates();
            console.log(`After taking medication: ${Object.keys(afterStates).length} medications persisted`);
            
            const morningKey = `1-${compartments[0]?.medications[0]?.id}`;
            if (afterStates[morningKey]?.status === 'taken') {
              console.log('✅ Persistence working! Morning medication status saved.');
              console.log('🔄 Try refreshing the page - timer position should be maintained!');
            } else {
              console.log('❌ Persistence failed - investigate...');
            }
          }, 100);
        },

        // 🧪 Simplified Device Event Sequence Testing
        testAdvancedEventProcessing: () => {
          console.log('🔬 Testing Real Device Event Sequence...');
          console.log('Simulating: LID_OPEN → TILT → LID_CLOSE → BUTTON → PILL_TAKE_EVENT');
          
          // Step 1: User opens compartment 2 (lunch)
          console.log('Step 1: LID_2_OPEN - User opens lunch compartment');
          console.log('  → Device tracks compartment 2 with timestamp');
          
          // Step 2: Simulate the complete device sequence
          setTimeout(() => {
            console.log('Step 2: Device processes TILT + LID_CLOSE + BUTTON sequence...');
            console.log('Step 3: Device sends PILL_TAKE_EVENT');
            (window as any).pillsureTest.simulateTakeEvent(2);
            console.log('  → Should use compartment 2 from previous LID_OPEN');
          }, 1000);
          
          setTimeout(() => {
            console.log('✅ Real device sequence test complete!');
            console.log('💡 The device does the smart detection, we just track context');
          }, 2000);
        },

        testTimerAccuracy: () => {
          console.log('⏱️ Testing Timer Accuracy & Phase Detection...');
          
          console.log('Step 1: Check current timer state...');
          console.log('Timer Phase:', timerState.currentPhase);
          console.log('Next Medication:', timerState.nextMedication?.name);
          console.log('Timer Start:', timerState.timerStart?.toLocaleTimeString());
          console.log('Timer End:', timerState.timerEnd?.toLocaleTimeString());
          
          if (timerState.timerStart && timerState.timerEnd) {
            const now = new Date();
            const progress = (now.getTime() - timerState.timerStart.getTime()) / 
                            (timerState.timerEnd.getTime() - timerState.timerStart.getTime());
            console.log(`Current Progress: ${(progress * 100).toFixed(2)}%`);
            
            const timeLeft = timerState.timerEnd.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            console.log(`Time Remaining: ${hours}hr ${minutes}min`);
          }
          
          console.log('✅ Timer accuracy test complete - check values above');
        },

        validateDeviceIntegration: () => {
          console.log('🔗 Validating Device-Timer Integration...');
          
          console.log('Device Connection:', deviceEvents.connected ? '✅ Connected' : '❌ Disconnected');
          console.log('Last Pill Event:', deviceEvents.lastPillEvent?.eventName || 'None');
          console.log('Connection Status:', deviceEvents.connectionStatus);
          
          // Test sequence: Take medication and verify timer updates
          console.log('Starting integration test sequence...');
          
          setTimeout(() => {
            console.log('1. Taking morning medication via device simulation...');
            (window as any).pillsureTest.simulateTakeEvent(1);
          }, 1000);
          
          setTimeout(() => {
            console.log('2. Checking timer state after device event...');
            console.log('Timer updated to:', timerState.nextMedication?.name || 'No next medication');
            console.log('Last completed:', timerState.lastCompletedMedication?.name || 'None');
          }, 2000);
          
          setTimeout(() => {
            console.log('✅ Device-timer integration validation complete!');
          }, 3000);
        },

        // 🎨 Phase 4 Testing - UI Restructure & Sections
        testUIRestructure: () => {
          console.log('🎨 Testing Phase 4: UI Restructure & Sections...');
          
          console.log('Step 1: Reset to mixed state for testing...');
          resetAllMedicationsToNewDay();
          
          setTimeout(() => {
            console.log('Step 2: Take morning medication → Should move to "Taken" section');
            updateMedicationStatus(1, compartments[0]?.medications[0]?.id, MedicationStatus.TAKEN, 'device');
          }, 1000);
          
          setTimeout(() => {
            console.log('Step 3: Miss evening medication → Should appear in "Missed" section');
            updateMedicationStatus(3, compartments[2]?.medications[0]?.id, MedicationStatus.MISSED, 'device');
          }, 2000);
          
          setTimeout(() => {
            console.log('✅ UI Structure Test Complete!');
            console.log('📊 Current sections visible:');
            const pendingCount = compartments.filter(c => c.medications.some(m => m.status === MedicationStatus.PENDING)).length;
            const takenCount = compartments.filter(c => c.medications.some(m => m.status === MedicationStatus.TAKEN)).length;
            const missedCount = compartments.filter(c => c.medications.some(m => m.status === MedicationStatus.MISSED)).length;
            
            console.log(`  → Pending: ${pendingCount} compartments`);
            console.log(`  → Taken: ${takenCount} compartments`);
            console.log(`  → Missed: ${missedCount} compartments`);
            console.log('🎯 Each section should be visually separated with proper styling');
          }, 3000);
        },

        testAllSections: () => {
          console.log('📱 Testing All UI Sections Simultaneously...');
          
          // Create a state where all three sections are visible
          console.log('Creating mixed state: Pending + Taken + Missed...');
          
          // Morning: Taken
          updateMedicationStatus(1, compartments[0]?.medications[0]?.id, MedicationStatus.TAKEN, 'device');
          
          // Lunch: Pending (leave as is)
          // updateMedicationStatus(2, compartments[1]?.medications[0]?.id, MedicationStatus.PENDING, 'manual');
          
          // Evening: Missed
          updateMedicationStatus(3, compartments[2]?.medications[0]?.id, MedicationStatus.MISSED, 'device');
          
          setTimeout(() => {
            console.log('✅ All sections now visible:');
            console.log('  1. Pending Medications (top)');
            console.log('  2. Taken Today (middle)');
            console.log('  3. Missed Today (bottom)');
            console.log('🎨 Check the visual hierarchy and separators');
          }, 1000);
        },

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
        // Test all scenarios including RELOAD_EVENT
        runFullTest: () => {
          console.log('🧪 === RUNNING FULL PILLSURE TEST ===');
          console.log('1. Device connection status:', deviceEvents.connectionStatus);
          console.log('2. Current state:', compartments.map(c => ({
            compartment: c.name,
            status: c.medications[0]?.status
          })));
          console.log('3. Timer state:', {
            nextMedication: timerState.nextMedication?.name,
            currentPhase: timerState.currentPhase
          });
          
          setTimeout(() => {
            console.log('4. Taking pill from compartment 2 (Lunch)...');
            (window as any).pillsureTest.simulatePillTaken(2);
          }, 1000);
          
          setTimeout(() => {
            console.log('5. Missing pill from compartment 1 (Morning)...');
            (window as any).pillsureTest.simulatePillMissed(1);
          }, 2000);
          
          setTimeout(() => {
            console.log('6. Testing RELOAD_EVENT (new day)...');
            (window as any).pillsureTest.simulateReloadEvent();
          }, 3000);
          
          setTimeout(() => {
            console.log('7. Testing invalid compartment...');
            (window as any).pillsureTest.simulatePillTaken(99);
          }, 4000);
          
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
      console.log('🎬 NEW: Cross-day timer with overnight support!');
      console.log('');
      console.log('📊 Basic Tests:');
      console.log('pillsureTest.simulatePillTaken(2)    // Take pill from compartment 2');
      console.log('pillsureTest.simulatePillMissed(1)   // Miss pill from compartment 1');
      console.log('pillsureTest.simulatePending(3)      // Set compartment 3 to pending');
      console.log('pillsureTest.simulateAllPending()    // Set all compartments to pending');
      console.log('pillsureTest.runFullTest()           // Run complete test sequence');
      console.log('');
      console.log('⏰ Timer Tests:');
      console.log('pillsureTest.testTimerPhases()       // Test all timer phases (green → blue)');
      console.log('pillsureTest.simulateOvernightTimer() // Force overnight timer (BLUE)');
      console.log('pillsureTest.testOvernightPhases()   // Test overnight timer activation');
      console.log('pillsureTest.showTimerDetails()      // Show detailed timer state');
      console.log('pillsureTest.testTimerAccuracy()     // Test timer accuracy & phase detection');
      console.log('');
      console.log('🔍 State Inspection:');
      console.log('pillsureTest.getCompartments()       // View medication status');
      console.log('pillsureTest.getTimerState()         // View timer state');
      console.log('pillsureTest.resetToDefaults()       // Reset to initial state');
      console.log('');
      console.log('🔬 Phase 3 - Advanced Testing:');
      console.log('pillsureTest.testAdvancedEventProcessing() // Test real device event sequence');
      console.log('pillsureTest.validateDeviceIntegration()   // Test device-timer integration');
      console.log('');
      console.log('🎨 Phase 4 - UI Structure & Sections:');
      console.log('pillsureTest.testUIRestructure()    // Test pending/taken/missed sections');
      console.log('pillsureTest.testAllSections()      // Show all three sections at once');
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

  // Phase 5 Testing - Enhanced timer with white veil overlay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).pillsurePhase5Test = {
        demonstrateWhiteVeil: () => {
          console.log(`
🎯 Phase 5 Demo: White Veil Overlay
───────────────────────────────────

✅ COMPLETED FEATURES:
• White transparent veil on elapsed portion of timer
• Enhanced gradient: from-white/95 via-white/90 to-white/75
• Proper capsule shape with rounded left corners
• Smooth width transitions (0.3s ease-out)
• Enhanced white tick with better shadow and z-index
• Performance optimizations with memoization
• Improved accessibility with ARIA progressbar
• Cross-day timer support with overnight blue theme

📊 Visual Improvements:
• Veil uses backdrop-filter: blur(0.5px) for subtle effect
• Progress tick has enhanced drop-shadow
• Better z-index layering (veil=default, tick=z-20)
• Figma-accurate styling with proper opacity gradients

🧪 Test Commands:
• pillsureTimerTest.approaching() - See white veil grow during approaching phase
• pillsureTimerTest.gracePeriod() - See veil with orange timer background  
• pillsureTimerTest.overnight() - See veil with blue overnight theme
• pillsureTimerTest.animation() - Watch veil animate smoothly

The white veil now perfectly matches the Figma design!
          `);
          
          // Demonstrate veil at different progress levels
          const demoSteps = [0.2, 0.5, 0.8];
          demoSteps.forEach((progress, index) => {
            setTimeout(() => {
              console.log(`Demo Step ${index + 1}: Veil covering ${progress * 100}% of timer bar`);
            }, index * 1000);
          });
        },
        
        testAllPhases: () => {
          console.log('🧪 Testing all timer phases with white veil...');
          
          // Test approaching phase
          setTimeout(() => {
            console.log('1️⃣ Approaching Phase - Green gradient with white veil');
            const props = (window as any).pillsureTimerTest.approaching();
            console.log('Props:', props);
          }, 0);
          
          // Test grace period
          setTimeout(() => {
            console.log('2️⃣ Grace Period Phase - Orange gradient with white veil');
            const props = (window as any).pillsureTimerTest.gracePeriod();
            console.log('Props:', props);
          }, 2000);
          
          // Test overnight
          setTimeout(() => {
            console.log('3️⃣ Overnight Phase - Blue gradient with white veil');
            const props = (window as any).pillsureTimerTest.overnight();
            console.log('Props:', props);
          }, 4000);
          
          setTimeout(() => {
            console.log('✅ All phases tested! White veil overlay working perfectly.');
          }, 6000);
        },
        
        help: () => {
          console.log(`
🚀 Phase 5 Complete: NextMedicationTimerBar
─────────────────────────────────────────

NEW FEATURES:
✅ White transparent veil overlay (matches Figma SVG)
✅ Enhanced visual layering with proper z-index
✅ Performance optimizations with memoization
✅ Improved accessibility with ARIA progressbar
✅ Smooth animations with backdrop filters

COMMANDS:
• pillsurePhase5Test.demonstrateWhiteVeil() - Show veil features
• pillsurePhase5Test.testAllPhases() - Test all timer phases
• pillsureTimerTest.help() - Show timer test commands

Phase 5 is COMPLETE! 🎉
          `);
        }
      };
    }
  }, []);

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Today</CardTitle>
            {/* <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground font-light">Compartments</p>
            </div> */}
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
        
        {/* Next Medication Timer Bar - Shows below title when there's a pending medication */}
        {timerState.nextMedication && (
          <div className="mt-4">
            <NextMedicationTimerBar
              nextMedication={timerState.nextMedication}
              lastMedicationCompletedAt={timerState.lastCompletedMedication?.lastUpdated}
              isNextDay={timerState.isNextDay}
              className=""
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Pending Medications Section */}
          {compartments
            .filter(compartment => 
              compartment.medications.some(med => med.status === MedicationStatus.PENDING)
            )
            .map((compartment, index, filteredCompartments) => (
            <div key={`pending-${compartment.id}`}>
              <div className="flex items-center py-2">
                <div className="flex-1 flex items-start">
                  <div className="flex flex-col items-center mr-6 w-16">
                    <div className="p-2">
                      {getCompartmentIcon(compartment.name)}
                    </div>
                    <span className="text-xs mt-1">{compartment.name}</span>
                  </div>

                  <div className="flex-1">
                    {compartment.medications
                      .filter(med => med.status === MedicationStatus.PENDING)
                      .map((medication) => (
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
                          <span className="ml-2 text-orange-500">
                            ({formatTimeRemainingNoSeconds(getTimeUntilAutoMissSeconds(medication))})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        {/* Display-only status indicator - device controlled */}
                        <div
                          className={cn(
                            "h-12 w-12 flex items-center justify-center rounded-md",
                            "transition-colors duration-200"
                          )}
                          aria-label={`${compartment.medications.find(m => m.status === MedicationStatus.PENDING)?.name} medication status: pending. Device controlled - no manual interaction available.`}
                          role="status"
                        >
                          <MedicationStatusIcon 
                            status={MedicationStatus.PENDING}
                            className="sr-only"
                          />
                          <span className="sr-only">Medication pending</span>
                          <MedicationStatusIcon status={MedicationStatus.PENDING} />
                        </div>
                        
                        {/* Testing button - only visible in dev mode */}
                        {devMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-50 hover:opacity-100"
                            onClick={() => {
                              const pendingMed = compartment.medications.find(m => m.status === MedicationStatus.PENDING);
                              if (pendingMed) cycleMedicationStatus(compartment.id, pendingMed.id);
                            }}
                          >
                            Test
                          </Button>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1">
                        <p className="font-medium">Device Controlled</p>
                        <p className="text-muted-foreground">Status: pending</p>
                        {devMode && (
                          <p className="text-blue-500">Dev mode: Click "Test" to override</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {index < filteredCompartments.length - 1 && <Separator className="my-2" />}
            </div>
          ))}

          {/* Taken Medications Section */}
          {compartments.some(compartment => 
            compartment.medications.some(med => med.status === MedicationStatus.TAKEN)
          ) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Taken Today
                </h3>
                
                {compartments
                  .filter(compartment => 
                    compartment.medications.some(med => med.status === MedicationStatus.TAKEN)
                  )
                  .map((compartment, index, filteredCompartments) => (
                  <div key={`taken-${compartment.id}`} className="flex items-center py-2 opacity-75">
                    <div className="flex-1 flex items-start">
                      <div className="flex flex-col items-center mr-6 w-16">
                        <div className="p-2 opacity-60">
                          {getCompartmentIcon(compartment.name)}
                        </div>
                        <span className="text-xs mt-1 text-muted-foreground">{compartment.name}</span>
                      </div>

                      <div className="flex-1">
                        {compartment.medications
                          .filter(med => med.status === MedicationStatus.TAKEN)
                          .map((medication) => (
                          <div key={medication.id} className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium text-sm text-muted-foreground">{medication.name}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {medication.dosage}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground font-light">
                              Taken at {medication.lastUpdated?.toLocaleTimeString() || 'Unknown time'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Taken status icon */}
                    <div className="h-12 w-12 flex items-center justify-center rounded-md">
                      <MedicationStatusIcon status={MedicationStatus.TAKEN} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Missed Medications Section (if any) */}
          {compartments.some(compartment => 
            compartment.medications.some(med => med.status === MedicationStatus.MISSED)
          ) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  Missed Today
                </h3>
                
                {compartments
                  .filter(compartment => 
                    compartment.medications.some(med => med.status === MedicationStatus.MISSED)
                  )
                  .map((compartment, index, filteredCompartments) => (
                  <div key={`missed-${compartment.id}`} className="flex items-center py-2 opacity-75">
                    <div className="flex-1 flex items-start">
                      <div className="flex flex-col items-center mr-6 w-16">
                        <div className="p-2 opacity-60">
                          {getCompartmentIcon(compartment.name)}
                        </div>
                        <span className="text-xs mt-1 text-muted-foreground">{compartment.name}</span>
                      </div>

                      <div className="flex-1">
                        {compartment.medications
                          .filter(med => med.status === MedicationStatus.MISSED)
                          .map((medication) => (
                          <div key={medication.id} className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium text-sm text-muted-foreground">{medication.name}</span>
                              <Badge variant="destructive" className="ml-2 text-xs">
                                {medication.dosage}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground font-light">
                              Missed (due at {medication.time})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missed status icon */}
                    <div className="h-12 w-12 flex items-center justify-center rounded-md">
                      <MedicationStatusIcon status={MedicationStatus.MISSED} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
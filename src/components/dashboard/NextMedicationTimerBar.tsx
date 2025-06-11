import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: 'pending' | 'taken' | 'missed';
  compartmentId?: number;
  lastUpdated?: Date;
}

interface NextMedicationTimerBarProps {
  nextMedication: Medication;
  lastMedicationCompletedAt?: Date;
  isNextDay?: boolean;
  className?: string;
}

interface TimerPhase {
  name: 'approaching' | 'grace-period' | 'overdue' | 'overnight';
  description: string; // "Morning dose in"
  timeRemaining: string; // "4hr 14min"
  progress: number;
  color: 'green' | 'orange' | 'red' | 'blue';
}

const NextMedicationTimerBar = ({ 
  nextMedication, 
  lastMedicationCompletedAt,
  isNextDay = false,
  className 
}: NextMedicationTimerBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerPhase, setTimerPhase] = useState<TimerPhase | null>(null);
  const animationFrameRef = useRef<number>();

  // Use requestAnimationFrame for smooth 60fps updates
  useEffect(() => {
    const updateTimer = () => {
      setCurrentTime(new Date());
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Enhanced timer calculation with cross-day support
  const calculateTimerPhase = (): TimerPhase | null => {
    const parseTimeToToday = (timeStr: string): Date => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : 
                           period === 'AM' && hours === 12 ? 0 : hours;
      
      const today = new Date();
      today.setHours(adjustedHours, minutes, 0, 0);
      return today;
    };

    const now = currentTime.getTime();

    // Handle overnight/next-day timer
    if (isNextDay) {
      const scheduledTime = parseTimeToToday(nextMedication.time);
      const tomorrowScheduled = new Date(scheduledTime);
      tomorrowScheduled.setDate(tomorrowScheduled.getDate() + 1);
      
      const timerStart = lastMedicationCompletedAt || new Date();
      const totalDuration = tomorrowScheduled.getTime() - timerStart.getTime();
      const elapsed = now - timerStart.getTime();
      const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
      
      const timeUntilNext = tomorrowScheduled.getTime() - now;
      const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
      
      let description: string;
      let timeRemaining: string;
      
      if (hours > 1) {
        description = "🌙 Next dose in";
        timeRemaining = `${hours}hr ${minutes}min`;
      } else if (hours === 1) {
        description = "🌅 Morning dose in";
        timeRemaining = `${hours}hr ${minutes}min`;
      } else if (minutes > 0) {
        description = "🌅 Morning dose in";
        timeRemaining = `${minutes}min`;
      } else {
        description = "🌅 Morning dose";
        timeRemaining = "starting now";
      }

      return {
        name: 'overnight',
        description,
        timeRemaining,
        progress,
        color: 'blue'
      };
    }

    // Regular same-day timer logic
    const scheduledTime = parseTimeToToday(nextMedication.time);
    const gracePeriodEnd = new Date(scheduledTime.getTime() + 30 * 60 * 1000); // 30min grace
    
    // Smart timer start calculation
    const timerStart = lastMedicationCompletedAt || (() => {
      // If no previous completion, start 4 hours before scheduled time
      const defaultStart = new Date(scheduledTime.getTime() - 4 * 60 * 60 * 1000);
      const startOfDay = new Date();
      startOfDay.setHours(6, 0, 0, 0); // 6 AM start of active day
      
      // Use whichever is later: default start or start of day
      return defaultStart > startOfDay ? defaultStart : startOfDay;
    })();

    const timerStartTime = timerStart.getTime();
    const scheduledTimeMs = scheduledTime.getTime();
    const gracePeriodEndMs = gracePeriodEnd.getTime();

    // Don't show timer if overdue (for same-day only)
    if (now > gracePeriodEndMs) {
      return null;
    }

    // Phase 1: Approaching scheduled time
    if (now < scheduledTimeMs) {
      const totalApproachTime = scheduledTimeMs - timerStartTime;
      const elapsedApproachTime = now - timerStartTime;
      const progress = Math.max(0, Math.min(1, elapsedApproachTime / totalApproachTime));
      
      const timeUntilScheduled = scheduledTimeMs - now;
      const hours = Math.floor(timeUntilScheduled / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilScheduled % (1000 * 60 * 60)) / (1000 * 60));
      
      // Get compartment name from medication name for cleaner display
      const getCompartmentDisplayName = (medName: string) => {
        // For Metformin, use the compartment context based on time
        const hour = parseInt(nextMedication.time.split(':')[0]);
        const period = nextMedication.time.includes('PM') ? 'PM' : 'AM';
        const hourIn24 = period === 'PM' && hour !== 12 ? hour + 12 : 
                        period === 'AM' && hour === 12 ? 0 : hour;
        
        if (hourIn24 < 11) return 'Morning';
        if (hourIn24 < 16) return 'Lunch'; 
        return 'Evening';
      };
      
      const displayName = getCompartmentDisplayName(nextMedication.name);
      
      let description: string;
      let timeRemaining: string;
      
      if (hours > 0) {
        description = `${displayName} dose in`;
        timeRemaining = `${hours}hr ${minutes}min`;
      } else if (minutes > 0) {
        description = `${displayName} dose in`;
        timeRemaining = `${minutes}min`;
      } else {
        description = `${displayName} dose`;
        timeRemaining = "starting now";
      }

      return {
        name: 'approaching',
        description,
        timeRemaining,
        progress,
        color: 'green'
      };
    }

    // Phase 2: Grace period (scheduled time to missed)
    const gracePeriodDuration = gracePeriodEndMs - scheduledTimeMs;
    const elapsedGracePeriod = now - scheduledTimeMs;
    const graceProgress = Math.max(0, Math.min(1, elapsedGracePeriod / gracePeriodDuration));
    
    const timeUntilMissed = gracePeriodEndMs - now;
    const minutes = Math.floor(timeUntilMissed / (1000 * 60));
    
    // Use same display name logic
    const getCompartmentDisplayName = (medName: string) => {
      const hour = parseInt(nextMedication.time.split(':')[0]);
      const period = nextMedication.time.includes('PM') ? 'PM' : 'AM';
      const hourIn24 = period === 'PM' && hour !== 12 ? hour + 12 : 
                      period === 'AM' && hour === 12 ? 0 : hour;
      
      if (hourIn24 < 11) return 'Morning';
      if (hourIn24 < 16) return 'Lunch'; 
      return 'Evening';
    };
    
    const displayName = getCompartmentDisplayName(nextMedication.name);
    
    let description: string;
    let timeRemaining: string;
    
    if (minutes > 0) {
      description = `⏰ ${displayName} dose becomes missed in`;
      timeRemaining = `${minutes}min`;
    } else {
      description = `⏰ ${displayName} dose`;
      timeRemaining = "becoming missed now";
    }

    return {
      name: 'grace-period',
      description,
      timeRemaining,
      progress: graceProgress,
      color: 'orange'
    };
  };

  // Calculate current phase
  useEffect(() => {
    const phase = calculateTimerPhase();
    setTimerPhase(phase);
  }, [currentTime, nextMedication, lastMedicationCompletedAt]);

  // Don't render if no timer phase calculated
  if (!timerPhase) {
    return null;
  }

  // Figma-accurate styling with enhanced visuals
  const getGradientClass = () => {
    switch (timerPhase.color) {
      case 'green':
        return 'from-emerald-100 via-green-400 to-emerald-600';
      case 'orange':
        return 'from-green-400 via-orange-400 to-red-500';
      case 'red':
        return 'from-orange-500 via-red-500 to-red-600';
      case 'blue':
        return 'from-blue-100 via-indigo-400 to-purple-600';
      default:
        return 'from-emerald-100 via-green-400 to-orange-500';
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      {/* Description text - Simple Sans 14px regular */}
      <div className="text-center">
        <p className="text-sm font-light text-gray-900 leading-tight">
          {timerPhase.description}
        </p>
      </div>

      {/* 16px separation */}
      <div className="h-4" />

      {/* Time remaining - Simple Sans 32px medium */}
      <div className="text-center">
        <p className="text-3xl font-medium text-gray-900 leading-tight">
          {timerPhase.timeRemaining}
        </p>
      </div>

      {/* 24px separation */}
      <div className="h-6" />

      {/* Figma-accurate capsule timer bar */}
      <div className={cn(
        "relative w-full h-5 rounded-full overflow-hidden shadow-inner",
        "bg-gradient-to-r", getGradientClass()
      )}>
        {/* Smooth white progress tick */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md opacity-90 transition-all duration-75 ease-out"
          style={{ 
            left: `${timerPhase.progress * 100}%`,
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
          }}
        />
      </div>

      {/* Enhanced accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Next medication timer: {nextMedication.name} {nextMedication.dosage} scheduled for {nextMedication.time}. 
        Current status: {timerPhase.description} {timerPhase.timeRemaining}. Progress: {Math.round(timerPhase.progress * 100)}%.
      </div>
    </div>
  );
};

export { NextMedicationTimerBar }; 
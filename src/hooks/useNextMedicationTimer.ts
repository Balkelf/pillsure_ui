import { useState, useEffect } from 'react';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: 'pending' | 'taken' | 'missed';
  compartmentId?: number;
  lastUpdated?: Date;
}

interface Compartment {
  id: number;
  name: "Morning" | "Lunch" | "Evening";
  medications: Medication[];
}

interface NextMedicationTimer {
  nextMedication: Medication | null;
  timerStart: Date | null;
  timerEnd: Date | null;
  currentPhase: 'pre-scheduled' | 'grace-period' | 'missed' | 'completed' | 'overnight';
  lastCompletedMedication: Medication | null;
  isNextDay: boolean;
}

export const useNextMedicationTimer = (compartments: Compartment[]): NextMedicationTimer => {
  const [timerState, setTimerState] = useState<NextMedicationTimer>({
    nextMedication: null,
    timerStart: null,
    timerEnd: null,
    currentPhase: 'completed',
    lastCompletedMedication: null,
    isNextDay: false
  });

  const parseTimeToToday = (timeStr: string): Date => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : 
                         period === 'AM' && hours === 12 ? 0 : hours;
    
    const today = new Date();
    today.setHours(adjustedHours, minutes, 0, 0);
    return today;
  };

  const findNextPendingMedication = (): { medication: Medication | null; isNextDay: boolean } => {
    const allMedications: Medication[] = [];
    
    compartments.forEach(compartment => {
      compartment.medications.forEach(medication => {
        allMedications.push(medication);
      });
    });

    const sortedMedications = allMedications.sort((a, b) => {
      const timeA = parseTimeToToday(a.time);
      const timeB = parseTimeToToday(b.time);
      return timeA.getTime() - timeB.getTime();
    });

    const now = new Date();
    
    // First, look for pending medications today
    for (const medication of sortedMedications) {
      if (medication.status === 'pending') {
        const scheduledTime = parseTimeToToday(medication.time);
        const gracePeriodEnd = new Date(scheduledTime.getTime() + 30 * 60 * 1000);
        
        if (now <= gracePeriodEnd) {
          return { medication, isNextDay: false };
        }
      }
    }

    // If no pending medications today, create next-day medication for tomorrow
    if (sortedMedications.length > 0) {
      const firstMedication = sortedMedications[0]; // Morning medication
      const tomorrowMedication: Medication = {
        ...firstMedication,
        id: firstMedication.id + 1000, // Unique ID for tomorrow
        status: 'pending',
        lastUpdated: undefined
      };
      
      return { medication: tomorrowMedication, isNextDay: true };
    }

    return { medication: null, isNextDay: false };
  };

  const findLastCompletedMedication = (): Medication | null => {
    const allMedications: Medication[] = [];
    
    compartments.forEach(compartment => {
      compartment.medications.forEach(medication => {
        allMedications.push(medication);
      });
    });

    const completedMedications = allMedications
      .filter(med => med.status === 'taken' && med.lastUpdated)
      .sort((a, b) => {
        if (!a.lastUpdated || !b.lastUpdated) return 0;
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      });

    return completedMedications.length > 0 ? completedMedications[0] : null;
  };

  useEffect(() => {
    const updateTimer = () => {
      const { medication: nextMedication, isNextDay } = findNextPendingMedication();
      const lastCompleted = findLastCompletedMedication();
      
      let timerStart: Date | null = null;
      let timerEnd: Date | null = null;
      let currentPhase: NextMedicationTimer['currentPhase'] = 'completed';

      if (nextMedication) {
        const now = new Date();
        const scheduledTime = parseTimeToToday(nextMedication.time);
        
        if (isNextDay) {
          // Cross-day timer: start from last completed medication or now
          timerStart = lastCompleted?.lastUpdated || now;
          const tomorrowScheduled = new Date(scheduledTime);
          tomorrowScheduled.setDate(tomorrowScheduled.getDate() + 1);
          timerEnd = tomorrowScheduled;
          currentPhase = 'overnight';
        } else {
          // Same day timer
          const gracePeriodEnd = new Date(scheduledTime.getTime() + 30 * 60 * 1000);

          // Enhanced timer start calculation with device event awareness
          timerStart = lastCompleted?.lastUpdated || (() => {
            // Smart fallback: use 4 hours before OR 6 AM, whichever gives better UX
            const defaultStart = new Date(scheduledTime.getTime() - 4 * 60 * 60 * 1000);
            const startOfDay = new Date();
            startOfDay.setHours(6, 0, 0, 0); // Medical day starts at 6 AM
            
            // Use the later time for more accurate timer positioning
            return defaultStart > startOfDay ? defaultStart : startOfDay;
          })();
          
          timerEnd = gracePeriodEnd;

          // Determine phase based on current time vs scheduled time
          const nowMs = now.getTime();
          const scheduledTimeMs = scheduledTime.getTime();
          const gracePeriodEndMs = gracePeriodEnd.getTime();
          
          if (nowMs > gracePeriodEndMs) {
            currentPhase = 'missed'; // Beyond grace period
          } else if (nowMs >= scheduledTimeMs) {
            currentPhase = 'grace-period'; // In grace period
          } else {
            currentPhase = 'pre-scheduled'; // Approaching scheduled time
          }
        }
      }

      setTimerState({
        nextMedication,
        timerStart,
        timerEnd,
        currentPhase,
        lastCompletedMedication: lastCompleted,
        isNextDay
      });
    };

    // Update immediately and then every minute for real-time accuracy
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // 60 second intervals

    return () => clearInterval(interval);
  }, [compartments]);

  return timerState;
}; 
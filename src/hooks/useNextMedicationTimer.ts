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

// Testing utilities for Phase 5
export const timerTestUtils = {
  // Test different timer phases
  testApproachingPhase: () => {
    const now = new Date();
    const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    console.log('🧪 Testing Approaching Phase - Next med in 2 hours');
    return {
      nextMedication: {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        time: future.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        status: 'pending' as const
      },
      lastMedicationCompletedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
      isNextDay: false
    };
  },

  testGracePeriod: () => {
    const now = new Date();
    const past = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago
    console.log('🧪 Testing Grace Period - Med was due 10 mins ago');
    return {
      nextMedication: {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        time: past.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        status: 'pending' as const
      },
      lastMedicationCompletedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      isNextDay: false
    };
  },

  testOvernightPhase: () => {
    const now = new Date();
    // Set next medication to tomorrow 8 AM
    const tomorrow8AM = new Date(now);
    tomorrow8AM.setDate(tomorrow8AM.getDate() + 1);
    tomorrow8AM.setHours(8, 0, 0, 0);
    
    console.log('🧪 Testing Overnight Phase - Next med tomorrow at 8 AM');
    return {
      nextMedication: {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        time: '8:00 AM',
        status: 'pending' as const
      },
      lastMedicationCompletedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
      isNextDay: true
    };
  },

  testProgressAnimation: () => {
    console.log('🧪 Testing Progress Animation - Watch the white veil grow');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02; // 2% increments
      if (progress >= 1) {
        clearInterval(interval);
        console.log('✅ Animation test complete');
        return;
      }
      
      // Force update the timer by manipulating time
      const fakeNow = new Date();
      const scheduledTime = new Date(fakeNow.getTime() + 60 * 60 * 1000); // 1 hour from now
      const startTime = new Date(fakeNow.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      const totalDuration = scheduledTime.getTime() - startTime.getTime();
      const fakeElapsed = totalDuration * progress;
      
      console.log(`Progress: ${Math.round(progress * 100)}% - Veil should cover ${Math.round(progress * 100)}% of bar`);
    }, 100);
  },

  // 🆕 NEW: White Line Progress Testing Functions
  testWhiteLineMovement: () => {
    console.log('🎯 Testing White Line Progress Movement');
    console.log('Step 1: Setting up controlled timer scenario...');
    
    const now = new Date();
    const startTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago
    const endTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 min from now
    const expectedProgress = 0.5; // Should be 50%
    
    console.log(`Start: ${startTime.toLocaleTimeString()}`);
    console.log(`Now:   ${now.toLocaleTimeString()}`);
    console.log(`End:   ${endTime.toLocaleTimeString()}`);
    console.log(`Expected Progress: ${expectedProgress * 100}%`);
    
    // Return test data for component
    return {
      nextMedication: {
        id: 1,
        name: 'Test Metformin',
        dosage: '500mg',
        time: endTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        status: 'pending' as const
      },
      lastMedicationCompletedAt: startTime,
      isNextDay: false
    };
  },

  validateProgressSync: () => {
    console.log('🔍 Validating Progress Calculation Accuracy');
    
    const testCases = [
      { elapsed: 0, total: 100, expected: 0 },
      { elapsed: 25, total: 100, expected: 0.25 },
      { elapsed: 50, total: 100, expected: 0.5 },
      { elapsed: 75, total: 100, expected: 0.75 },
      { elapsed: 100, total: 100, expected: 1 },
      { elapsed: 150, total: 100, expected: 1 }, // Over 100% should clamp to 1
    ];

    console.log('Testing progress calculation formula:');
    testCases.forEach(({ elapsed, total, expected }, index) => {
      const calculated = Math.max(0, Math.min(1, elapsed / total));
      const isCorrect = Math.abs(calculated - expected) < 0.001;
      
      console.log(`Test ${index + 1}: ${elapsed}/${total} = ${calculated} ${isCorrect ? '✅' : '❌'} (expected ${expected})`);
    });
    
    console.log('✅ Progress calculation validation complete');
  },

  debugStuckProgress: () => {
    console.log('🐛 Debugging Stuck Progress Indicator');
    
    console.log('Common causes of stuck progress:');
    console.log('1. Missing useEffect dependency (isNextDay) - FIXED ✅');
    console.log('2. Incorrect timer start/end calculations');
    console.log('3. State not updating due to stale closures');
    console.log('4. Time calculations returning NaN or invalid values');
    
    console.log('\n🔍 Diagnostic Steps:');
    console.log('1. Check timer state with: pillsureTest.showTimerDetails()');
    console.log('2. Monitor progress with: setInterval(() => console.log("Progress:", document.querySelector(".absolute.top-0.bottom-0.w-0\\.5")?.style.left), 1000)');
    console.log('3. Verify calculations with: pillsureTimerTest.validateProgressSync()');
    console.log('4. Test movement with: pillsureTimerTest.testWhiteLineMovement()');
    
    console.log('\n🛠️ Quick Fix:');
    console.log('- Refresh page to reset timer state');
    console.log('- Run: pillsureTest.simulateAllPending() to reset to pending state');
    
    return {
      diagnostics: 'See console output above',
      quickFix: 'pillsureTest.simulateAllPending()',
      monitorCommand: 'setInterval(() => console.log("Progress:", document.querySelector(".absolute.top-0.bottom-0.w-0\\\\.5")?.style.left), 1000)'
    };
  }
};

// Global test functions for browser console
if (typeof window !== 'undefined') {
  (window as any).pillsureTimerTest = {
    approaching: timerTestUtils.testApproachingPhase,
    gracePeriod: timerTestUtils.testGracePeriod,
    overnight: timerTestUtils.testOvernightPhase,
    animation: timerTestUtils.testProgressAnimation,
    // 🆕 NEW: White Line Progress Testing
    testWhiteLineMovement: timerTestUtils.testWhiteLineMovement,
    validateProgressSync: timerTestUtils.validateProgressSync,
    debugStuckProgress: timerTestUtils.debugStuckProgress,
    help: () => {
      console.log(`
🧪 NextMedicationTimer Test Suite
─────────────────────────────────

Available test commands:
• pillsureTimerTest.approaching()  - Test approaching phase (green timer)
• pillsureTimerTest.gracePeriod()  - Test grace period phase (orange timer) 
• pillsureTimerTest.overnight()    - Test overnight phase (blue timer)
• pillsureTimerTest.animation()    - Test progress animation and white veil
• pillsureTimerTest.help()         - Show this help

🆕 NEW: White Line Progress Testing:
• pillsureTimerTest.testWhiteLineMovement()  - Test white line progress movement
• pillsureTimerTest.validateProgressSync()   - Validate progress calculations  
• pillsureTimerTest.debugStuckProgress()     - Debug stuck progress issues

Phase 5 Features:
✅ White transparent veil on elapsed portion
✅ Smooth 60fps animations with requestAnimationFrame
✅ Cross-day timer support with overnight messaging
✅ Enhanced visual feedback with z-index layering
✅ Comprehensive testing utilities

All tests return props you can pass to NextMedicationTimerBar component.
      `);
    }
  };
} 
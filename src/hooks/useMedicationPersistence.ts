import { useCallback } from 'react';

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

interface PersistedMedicationState {
  id: number;
  compartmentId?: number;
  status: string;
  lastUpdated?: string;
}

const STORAGE_KEYS = {
  MEDICATION_STATES: 'pillsure_medication_states',
  LAST_SYNC: 'pillsure_last_sync'
} as const;

export const useMedicationPersistence = () => {
  const persistMedicationStates = useCallback((compartments: Compartment[]) => {
    try {
      const allMedications = compartments.flatMap(compartment => 
        compartment.medications.map(medication => ({
          id: medication.id,
          compartmentId: medication.compartmentId,
          status: medication.status,
          lastUpdated: medication.lastUpdated?.toISOString()
        }))
      );
      
      localStorage.setItem(STORAGE_KEYS.MEDICATION_STATES, JSON.stringify(allMedications));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
      console.log('💾 Medication states persisted:', allMedications.length, 'medications');
    } catch (error) {
      console.warn('Failed to persist medication states:', error);
    }
  }, []);

  const loadPersistedMedicationStates = useCallback((): Record<string, { status: string; lastUpdated?: Date }> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDICATION_STATES);
      if (!stored) return {};
      
      const states: PersistedMedicationState[] = JSON.parse(stored);
      const result: Record<string, { status: string; lastUpdated?: Date }> = {};
      
      states.forEach((state) => {
        const key = `${state.compartmentId}-${state.id}`;
        result[key] = {
          status: state.status,
          lastUpdated: state.lastUpdated ? new Date(state.lastUpdated) : undefined
        };
      });
      
      console.log('📂 Loaded persisted states for', Object.keys(result).length, 'medications');
      return result;
    } catch (error) {
      console.warn('Failed to load persisted medication states:', error);
      return {};
    }
  }, []);

  const clearPersistedStates = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MEDICATION_STATES);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
      console.log('🗑️ Cleared all persisted medication states');
    } catch (error) {
      console.warn('Failed to clear persisted states:', error);
    }
  }, []);

  const getLastSyncTime = useCallback((): Date | null => {
    try {
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      return null;
    }
  }, []);

  return {
    persistMedicationStates,
    loadPersistedMedicationStates,
    clearPersistedStates,
    getLastSyncTime
  };
}; 
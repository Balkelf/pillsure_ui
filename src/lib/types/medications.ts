
export interface CustomMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once' | 'twice' | 'three_times' | 'custom';
  times: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  compartment?: string;
}

export interface MedicationSchedule {
  morning: CustomMedication[];
  afternoon?: CustomMedication[];
  evening: CustomMedication[];
}

export type DosageFrequency = 'once' | 'twice' | 'three_times' | 'custom';

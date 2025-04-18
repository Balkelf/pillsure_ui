// Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions?: string;
  startDate: string;
  endDate?: string;
}

export interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  active: boolean;
  type: 'daily' | 'custom' | 'one-time';
  days?: number[]; // 0-6 for Sunday-Saturday
  date?: string; // For one-time reminders
}

export interface CaregiverContact {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
  notificationsEnabled: boolean;
  lastActivity?: string;
}

export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'blood_glucose' | 'weight' | 'hba1c' | 'custom';
  value: number | string;
  unit: string;
  timestamp: string;
  notes?: string;
}

// Mock Data
export const medications: Medication[] = [
  {
    id: "med1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    times: ["08:00", "14:00"],
    instructions: "Take with food",
    startDate: "2023-01-15",
  },
  {
    id: "med2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    times: ["08:00"],
    instructions: "Take with or without food",
    startDate: "2023-02-10",
  },
  {
    id: "med3",
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    times: ["08:00"],
    instructions: "Take with food",
    startDate: "2023-01-01",
  },
  {
    id: "med4",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    times: ["20:00"],
    instructions: "Take in the evening",
    startDate: "2023-03-15",
  }
];

export const reminders: Reminder[] = [
  {
    id: "rem1",
    medicationId: "med1",
    time: "08:00",
    active: true,
    type: "daily",
  },
  {
    id: "rem2",
    medicationId: "med1",
    time: "14:00",
    active: true,
    type: "daily",
  },
  {
    id: "rem3",
    medicationId: "med2",
    time: "20:00",
    active: true,
    type: "daily",
  },
  {
    id: "rem4",
    medicationId: "med3",
    time: "08:00",
    active: true,
    type: "daily",
  }
];

export const caregivers: CaregiverContact[] = [
  {
    id: "care1",
    name: "John Smith",
    relationship: "Son",
    email: "john.smith@example.com",
    phone: "+1234567890",
    notificationsEnabled: true,
    lastActivity: "2023-04-15T14:30:00Z",
  },
  {
    id: "care2",
    name: "Dr. Sarah Johnson",
    relationship: "Doctor",
    email: "sarah.johnson@medfacility.com",
    notificationsEnabled: true,
    lastActivity: "2023-04-10T09:15:00Z",
  },
  {
    id: "care3",
    name: "Michael Anderson",
    relationship: "Spouse",
    email: "michael.anderson@example.com",
    phone: "+1987654321",
    notificationsEnabled: true,
    lastActivity: "2023-04-16T18:45:00Z",
  }
];

export const healthMetrics: HealthMetric[] = [
  {
    id: "bp1",
    type: "blood_pressure",
    value: "120/80",
    unit: "mmHg",
    timestamp: "2023-04-11T08:30:00Z",
  },
  {
    id: "bg1",
    type: "blood_glucose",
    value: 120,
    unit: "mg/dL",
    timestamp: "2023-04-11T08:35:00Z",
  },
  {
    id: "bp2",
    type: "blood_pressure",
    value: "125/82",
    unit: "mmHg",
    timestamp: "2023-04-12T08:30:00Z",
  },
  {
    id: "bg2",
    type: "blood_glucose",
    value: 135,
    unit: "mg/dL",
    timestamp: "2023-04-12T08:35:00Z",
  },
  {
    id: "bp3",
    type: "blood_pressure",
    value: "118/75",
    unit: "mmHg",
    timestamp: "2023-04-13T08:30:00Z",
  },
  {
    id: "bg3",
    type: "blood_glucose",
    value: 115,
    unit: "mg/dL",
    timestamp: "2023-04-13T08:35:00Z",
  },
  {
    id: "bp4",
    type: "blood_pressure",
    value: "122/80",
    unit: "mmHg",
    timestamp: "2023-04-14T08:30:00Z",
  },
  {
    id: "bg4",
    type: "blood_glucose",
    value: 125,
    unit: "mg/dL",
    timestamp: "2023-04-14T08:35:00Z",
  },
  {
    id: "bp5",
    type: "blood_pressure",
    value: "120/78",
    unit: "mmHg",
    timestamp: "2023-04-15T08:30:00Z",
  },
  {
    id: "bg5",
    type: "blood_glucose",
    value: 110,
    unit: "mg/dL",
    timestamp: "2023-04-15T08:35:00Z",
  },
  {
    id: "bp6",
    type: "blood_pressure",
    value: "115/75",
    unit: "mmHg",
    timestamp: "2023-04-16T08:30:00Z",
  },
  {
    id: "bg6",
    type: "blood_glucose",
    value: 105,
    unit: "mg/dL",
    timestamp: "2023-04-16T08:35:00Z",
  },
  {
    id: "bp7",
    type: "blood_pressure",
    value: "118/76",
    unit: "mmHg",
    timestamp: "2023-04-17T08:30:00Z",
  },
  {
    id: "bg7",
    type: "blood_glucose",
    value: 115,
    unit: "mg/dL",
    timestamp: "2023-04-17T08:35:00Z",
  },
  {
    id: "hba1c1",
    type: "hba1c",
    value: 52,
    unit: "mmol/mol",
    timestamp: "2023-10-17T09:00:00Z",
    notes: "Initial measurement"
  },
  {
    id: "hba1c2",
    type: "hba1c",
    value: 48,
    unit: "mmol/mol",
    timestamp: "2024-04-15T09:00:00Z",
    notes: "Improvement after medication adherence"
  }
];

// Helper functions
export function getNextMedication(): Medication | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
  
  // First check for Metformin as it's the primary medication in the titration schedule
  const metformin = medications.find(med => med.name === "Metformin");
  if (metformin) {
    const nextMetforminTime = metformin.times.find(time => time > currentTimeStr);
    if (nextMetforminTime) {
      return metformin;
    }
  }
  
  // If no next Metformin dose, check other medications
  let closestMed: Medication | null = null;
  let closestTime: string | null = null;
  
  medications.forEach(med => {
    med.times.forEach(time => {
      if (time > currentTimeStr && (!closestTime || time < closestTime)) {
        closestTime = time;
        closestMed = med;
      }
    });
  });
  
  return closestMed;
}

export function getAdherenceRate(): number {
  // This would normally calculate based on actual taken/missed data
  return 85; // Mock 85% adherence
}

export function getAdherenceByDay(): { day: string; adherence: number }[] {
  // This would normally calculate based on historical data
  return [
    { day: "Mon", adherence: 100 },
    { day: "Tue", adherence: 100 },
    { day: "Wed", adherence: 75 },
    { day: "Thu", adherence: 100 },
    { day: "Fri", adherence: 50 },
    { day: "Sat", adherence: 100 },
    { day: "Sun", adherence: 100 },
  ];
}

export function getCurrentStreak(): number {
  // This would normally calculate based on historical data
  return 3; // Mock 3-day streak
}

// New helper functions for HbA1c
export function getLatestHbA1c(): { value: number, timestamp: string } | null {
  const hba1cMeasurements = healthMetrics.filter(metric => metric.type === 'hba1c');
  
  if (hba1cMeasurements.length === 0) {
    return null;
  }
  
  const sortedMeasurements = [...hba1cMeasurements].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const latest = sortedMeasurements[0];
  return { 
    value: Number(latest.value), 
    timestamp: latest.timestamp 
  };
}

export function isHbA1cCheckDue(): boolean {
  const latest = getLatestHbA1c();
  if (!latest) return true;
  
  const latestDate = new Date(latest.timestamp);
  const nextCheckDate = new Date(latestDate);
  nextCheckDate.setMonth(nextCheckDate.getMonth() + 6); // Next check in 6 months
  
  return new Date() > nextCheckDate;
}

export function getHbA1cTrend(): 'improving' | 'worsening' | 'stable' | 'unknown' {
  const hba1cMeasurements = healthMetrics
    .filter(metric => metric.type === 'hba1c')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  if (hba1cMeasurements.length < 2) {
    return 'unknown';
  }
  
  const firstValue = Number(hba1cMeasurements[0].value);
  const lastValue = Number(hba1cMeasurements[hba1cMeasurements.length - 1].value);
  
  const difference = lastValue - firstValue;
  
  if (Math.abs(difference) < 3) {
    return 'stable';
  }
  
  return difference < 0 ? 'improving' : 'worsening';
}

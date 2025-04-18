
export interface Device {
  id: string;
  device_id: string;
  user_id: string;
  name: string;
  battery_level: number;
  last_sync: string;
  status: string;
  device_mode: "daily" | "multiday";
  created_at: string;
  updated_at: string;
  device_compartments?: DeviceCompartment[];
}

export interface DeviceCompartment {
  id: string;
  device_id: string;
  name: string;
  max_capacity: number;
  current_capacity: number;
  lid_angle?: number;
  lid_last_opened?: string;
  created_at: string;
  updated_at: string;
  medications?: CompartmentMedication[];
}

export interface CompartmentMedication {
  id: string;
  compartment_id: string;
  medication_id?: string;
  name: string;
  dosage?: string;
  count: number;
  time?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  schedule_id?: string;
  user_id: string;
  medication_id?: string;
  status: "taken" | "missed" | "upcoming";
  scheduled_time: string;
  taken_time?: string;
  created_at: string;
}

export interface MedicationSchedule {
  id: string;
  user_id: string;
  medication_id?: string;
  name: string;
  dosage?: string;
  frequency: string;
  times: string[];
  status: "taken" | "missed" | "upcoming";
  week?: number;
  notes?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}


export interface CompartmentStatus {
  id: number | string;
  name: string;
  maxCapacity: number;
  currentCapacity: number;
  medications: CompartmentMedication[];
}

export interface CompartmentMedication {
  id: number | string;
  name: string;
  dosage: string;
  count: number;
  time: string;
}

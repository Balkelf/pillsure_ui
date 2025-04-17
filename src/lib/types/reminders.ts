
export interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  active: boolean;
  type: 'daily' | 'weekly';
}

export interface SmartReminder {
  id: string;
  medicationId: string;
  time?: string;
  active: boolean;
  type: 'daily' | 'weekly';
  location?: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // in meters
  };
  smartType: 'time' | 'location' | 'both';
}

export interface LocationTrigger {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

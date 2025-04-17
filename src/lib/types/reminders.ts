
export interface SmartReminder extends Reminder {
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

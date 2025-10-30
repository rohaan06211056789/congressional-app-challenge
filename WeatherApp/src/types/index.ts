export interface RainfallData {
  id?: string;
  date: string;
  precipitation_mm: number;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  temperature_max?: number;
  temperature_min?: number;
  drought_risk?: 'Low' | 'Medium' | 'High';
  ai_explanation?: string;
  ai_suggestions?: string[];
}

export interface Settings {
  id?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  alert_email?: string;
  enable_alerts?: boolean;
  last_fetch?: string;
  use_auto_location?: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  location_name?: string;
  timezone?: string;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}



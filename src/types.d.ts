
export type ISystem = {
  countryCode: string;
  name: string;
  location: string;
  systemID: string;
  url: string;
  autoDiscoveryURL: string;
  validationReport?: string | undefined;
}

export type CsvRow = {
  'Country Code': string;
  'Name': string;
  'Location': string;
  'System ID': string;
  'URL': string;
  'Auto-Discovery URL': string;
  'Validation Report': string;
};

export type GbfsResponse = {
  last_updated?: number;
  ttl?: number;
  data: FeedLanguage;
}

export type FeedLanguage = {
  [language: string]: Feeds;
}

export type Feeds = {
  feeds: Feed[];
}

export type Feed = {
  name: string;
  url: string;
}

export type StationInformationResponseObject = {
  data: {
    stations: StationInfo[];
  };
}

export type StationStatusResponseObject = {
  data: {
    stations: StationStatus[];
  };
}

export type SystemInfoResponseObject = {
  data: SystemInfo;
}

export type StationStatus = {
  station_id: string;
  num_vehicles_available?: number;
  vehicle_types_available?: any;
  num_vehicles_disabled?: number;
  num_docks_available?: number;
  vehicle_docks_available?: any;
  num_docks_disabled?: number;
  is_installed?: boolean;
  is_renting?: boolean;
  is_returning?: boolean;
  last_reported?: number;
}

export type StationInfo = {
  station_id: string;
  name?: string;
  short_name?: string;
  lat: number;
  lon: number;
  address?: string;
  cross_street?: string;
  region_id?: string;
  post_code?: string;
  station_opening_hours?: string;
  rental_methods?: Array<string>;
  is_virtual_station?: boolean;
  station_area?: number[];
  parking_type?: string;
  parking_hoop?: boolean;
  contact_phone?: string;
  capacity?: number;
  vehicle_type_area_capacity?: any;
  vehicle_type_dock_capacity?: any;
  is_valet_station?: boolean;
  is_charging_station?: boolean;
  rental_uris?: {
    android?: URL;
    ios?: URL;
    web?: URL;
  };
}

export type SystemInfo = {
  system_id: string;
  language?: string;
  name?: string;
  short_name?: string;
  operator?: string;
  opening_hours?: string;
  start_date?: string;
  url?: URL;
  purchase_url?: URL;
  phone_number?: number;
  email?: string;
  feed_contact_email?: string;
  timezone: string;
  license_url?: URL;
  terms_url?: string[];
  terms_last_updated?: string;
  privacy_url?: string[];
  privacy_last_updated?: string;
  rental_apps?: string[];
  brand_assets?: string[];
}

export type StationUnified = {
  station_id: string;
  name?: string;
  short_name?: string;
  lat: number;
  lon: number;
  address?: string;
  cross_street?: string;
  region_id?: string;
  post_code?: string;
  station_opening_hours?: string;
  rental_methods?: Array<string>;
  is_virtual_station?: boolean;
  station_area?: number[];
  parking_type?: string;
  parking_hoop?: boolean;
  contact_phone?: string;
  capacity?: number;
  vehicle_type_area_capacity?: any;
  vehicle_type_dock_capacity?: any;
  is_valet_station?: boolean;
  is_charging_station?: boolean;
  rental_uris?: {
    android?: URL;
    ios?: URL;
    web?: URL;
  };
  num_vehicles_available?: number;
  vehicle_types_available?: any;
  num_vehicles_disabled?: number;
  num_docks_available?: number;
  vehicle_docks_available?: any;
  num_docks_disabled?: number;
  is_installed?: boolean;
  is_renting?: boolean;
  is_returning?: boolean;
  last_reported?: number;
}

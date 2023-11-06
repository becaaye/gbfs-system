interface GbfsResponse {
  last_updated?: number;
  ttl?: number;
  data: FeedLanguage;
}

interface FeedLanguage {
  [language: string]: Feeds;
}

interface Feeds {
  feeds: Feed[];
}

interface Feed {
  name: string;
  url: string;
}

interface StationInformationResponseObject {
  data: {
    stations: StationInfo[];
  };
}

interface StationStatusResponseObject {
  data: {
    stations: StationStatus[];
  };
}

interface SystemInfoResponseObject {
  data: SystemInfo;
}

interface StationStatus {
  station_id: string;
  num_vehicles_available?: number;
  vehicle_types_available?: any;
  num_vehicles_disabled?: number;
  num_docks_available?: number;
  vehicle_docks_available?: any;
  num_docks_disabled?: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
}

interface StationInfo {
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

interface SystemInfo {
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

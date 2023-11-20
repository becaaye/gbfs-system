[![Release](https://github.com/becaaye/gbfs-system/actions/workflows/release.yml/badge.svg?branch=main&event=push)](https://github.com/becaaye/gbfs-system/actions/workflows/release.yml)
![license](https://img.shields.io/badge/license-ISC-green)

## 1. Introduction

GBFS (General Bikeshare Feed Specification) is a standardized data feed for shared mobility system availability, such as bikes and scooters. It provides a unified format for sharing real-time information about the location, status, and availability of these systems.

## 2. Problem Statement

The `gbfs-system` library aims to simplify the interaction with GBFS-compliant systems, providing easy access to shared mobility data like station information, system status, and more.
`gbfs-system` is a Node.js package to seamlessly retrieve real-time data from GBFS (General Bikeshare Feed Specification) using the auto-discovery URLs provided by MobilityData. Perfect for developers aiming to leverage live bikeshare system information, station statuses, and other essential data to innovate in their applications and services.

## 3. Installation

To install the library via npm, use the following command:

```bash
npm install gbfs-system
```

## 4. Usage

### 4.1 Systems Module

The `Systems` module helps in finding nearby bike systems based on a given city or location.

```javascript
import { Systems } from "gbfs-system";
// Import the Systems module
```

```typescript
// initialize the Systems class
const SYSTEMS = await Systems.initialize();

const system_data_by_location = SYSTEMS.findByLocation("dubai");
console.log(system_data_by_location);
/*
[{
  countryCode: 'AE',
  name: 'Careem BIKE',
  location: 'Dubai, AE',
  systemID: 'careem_bike',
  url: 'https://www.careem.com/en-ae/...',
  autoDiscoveryURL: 'https://dubai.public.../gbfs.json',
...
}]
*/

const system_data_by_country = SYSTEMS.findByCountryCode("BR");
console.log(system_data_by_country);
/*
[
  {
    countryCode: 'BR',
    name: 'Bike Itaú - Rio',
    location: 'Rio de Janeiro, BR',
    systemID: 'bike_rio',
    url: 'https://bikeitau.com...',
    autoDiscoveryURL: 'https://riodejaneiro.public...gbfs.json',
  ...
  },
  and 205 more...
]
*/

const system_data_by_name = SYSTEMS.findByName("bixi");
console.log(system_data_by_name);
/*
[
  {
  countryCode: 'CA',
  name: 'BIXI Montréal',
  location: 'Montréal, CA',
  systemID: 'Bixi_MTL',
  url: 'https://www.bixi...',
  autoDiscoveryURL: 'https://gbfs.velo...gbfs.json'
  }
]
*/

const system_data_by_id = SYSTEMS.findBySystemID("dott-paris");
console.log(system_data_by_id);
/*
{
  countryCode: 'FR',
  name: 'Dott Paris',
  location: 'Paris,FR',
  systemID: 'dott-paris',
  url: 'https://ridedott...',
  autoDiscoveryURL: 'https://gbfs.api...gbfs.json',
  validationReport: 'https://gbfs-validator...gbfs.json'
}
*/
```

### 4.2 Gbfs Module

The `Gbfs` module provides methods to interact with a GBFS-compliant system, such as fetching station information and system status.

```javascript
import { Gbfs } from "gbfs-system";
// Import the Gbfs module
```

```typescript
const autoDiscoveryURL = "https://gbfs.example.com/gbfs.json";

// create a new Gbfs instance with the auto-discovery url
const gbfs = await Gbfs.initialize(autoDiscoveryURL);

// Get all stations informations
const station_info_data = await gbfs.stationInfo();
console.log(station_info_data);
/* 
[
  {
    "station_id": "1",
    "name": "Métro Champ-de-Mars ( Viger / Sanguinet )",
    "short_name": "6001",
    "lat": 45.51025293,
    "lon": -73.5567766,
    "capacity": 35,
    ...
  },
  and 205 more...
] 
*/

// Get all stations status
const station_status_data = await gbfs.stationStatus();
console.log(station_status_data);
/* 
[
  {
    "station_id": "1",
    "num_bikes_available": 16,
    "num_ebikes_available": 3,
    "num_docks_available": 8,
    ...
  },
  and 205 more...
]
*/

// Get the system information
const system_info_data = await gbfs.systemInfo();
console.log(system_info_data);
/* 
{
  "system_id": "Bixi_MTL",
  "language": "en",
  "name": "Bixi_MTL",
  ...
} 
*/
```

#### 4.3 Get a Single Station Data

For both `stationInfo()` and `stationStatus()`, retrieve data for a specific station by providing the `station_id`.

```typescript
gbfs.stationStatus("12").then((station) => console.log(station));
```

#### 4.4 Feed Language Management

Some gbfs clients can provide their feed data in multiple languages depending on their public's needs. The example below from Velobixi in Montreal is the response data of the autodiscovery url (or gbfs.json). We can see the feeds are provided in english 'en' and in french 'fr'.
```json
{
  "last_updated": 1234567890,
  "ttl": 10,
  "data": {
    "en": {
      "feeds": [
        {
        "name": "station_status",
        "url": "https://gbfs.velobixi.../en/station_status.json"
        },
        ...
      ]
    },
    "fr": {
      "feeds": [
        {
        "name": "station_status",
        "url": "https://gbfs.velobixi.../fr/station_status.json"
        },
        ...
      ]
    }
  }
}
```

You can fetch data in a different language with one of these 2 options:

```typescript
// Change the feed language for the selected instance
gbfs.setPreferredFeedLanguage = "fr";

// Define language at creation
const gbfsInFrench = await Gbfs.initialize(autoDiscoveryURL, "fr");
```

To handle supported languages:

```typescript
gbfs.getSupportedLanguages(); // ['en', 'fr']
gbfs.isLanguageSupported("fr"); // true
```

> If no prefered feed language is defined, The first found feed language is used to retrieve data.

## API Reference

### Systems Module

| Method              | Description                   | Parameters            | Returns          |
| ------------------- | ----------------------------- | --------------------- | ---------------- |
| `initialize`   | Static factory method that creates a new Systems instance. | - | `Systems` |
| `findByLocation`    | Finds systems in a given city | `location: string`    | `Array<ISystem>` |
| `findByCountryCode` | Finds systems by country code | `countryCode: string` | `Array<ISystem>` |
| `findBySystemID`    | Finds a system by its ID      | `systemID: string`    | `ISystem`        |
| `findByName`        | Finds systems by name         | `name: string`        | `Array<ISystem>` |

### GBFS Module

| Method          | Description                        | Parameters           | Returns                              |
| --------------- | ---------------------------------- | -------------------- | ------------------------------------ |
| `initialize`   | Static factory method that creates a new Gbfs instance with its url. | `autoDiscvoeryURL:string` and `preferedFeedLanguage?: string` | `Gbfs` |
| `stationInfo`   | Fetches station information        | `stationId?: string` | `Array<StationInfo>` or `StationInfo`     |
| `stationStatus` | Fetches station status             | `stationId?: string` | `Array<StationStatus>` or `StationStatus` |
| `systemInfo`    | Fetches general system information | -                    | `SystemInfo`                         |
| `getSupportedLanguages`   | Returns an array of all feed language codes | - | `Array<string>`|
| `isLanguageSupported`   | Returns true if the feed language code is supported | `language:string` | `Boolean` |

> More methods will be added to support data retreival from other feeds.

## Compatibility

The current package is designed for ESModules, so you can use the module you want with the import statement. Future versions aim to include compatibility with CommonJS. As for now, you can import the modules as mentioned above.

You might also consider the fact that some operators may have in place several security neasures on their API servers such as IP whitelisting, rate limits, etc that may sometimes impact the outcome of some requests and may throw errors like this :

```bash
Error: Failed to retrieve data from https://gbfs.example.com/system_information.json: AxiosError: Request failed with status code 403
```

## Contributing
- Contributions to the `gbfs-system` library are welcome. Please fork the project, create a new branche from `main` and name it like this : `feature/your-awesome-feature`. Once you done, push on the remote repository and create a pull-request.

- For bugs and feature requests, please use the [issues section on GitHub](https://github.com/becaaye/gbfs-system/issues).

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any queries or contributions, please contact at becaye00@gmail.com

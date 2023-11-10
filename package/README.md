# GBFS Data Fetcher

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-ISC-green)

A Node.js package to seamlessly retrieve real-time data from GBFS (General Bikeshare Feed Specification) using the auto-discovery URLs provided by MobilityData. Perfect for developers aiming to leverage live bikeshare system information, station statuses, and other essential data to innovate in their applications and services.

## Table of Contents

- [GBFS Data Fetcher](#gbfs-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Get a System's feeds](#get-a-systems-feeds)
    - [Single Station Data](#single-station-data)
    - [Feed Language Management](#feed-language-management)
  - [Compatibility](#compatibility)
  - [API](#api)
    - [Gbfs class](#gbfs-class)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support](#support)
  - [Contact](#contact)

## Overview

The General Bikeshare Feed Specification (GBFS) is a standardized data feed system for shared mobility systems, allowing systems to specify real-time data about their system's operations. This utility provides an implementation of GBFS, enabling users to interact with GBFS data more effectively.

Understanding and using GBFS can assist in integrating shared mobility system data into applications, maps, and other platforms, providing real-time information on bike availability, station status, and more.


## Installation

```bash
npm install @becaaye/gbfs-system
```

## Usage

### Get a System's feeds

```typescript
import { Gbfs } from "@becaaye/gbfs-system";

const autoDiscoveryURL = "https://gbfs.example.com/gbfs.json"

// create a new Gbfs object
const gbfs = await Gbfs.create(autoDiscoveryURL);

// Get all stations information
gbfs.stationInfo()
    .then((stations) => console.log(stations));
    /* [
        {
            "station_id": "1",
            "name": "Métro Champ-de-Mars ( Viger / Sanguinet )",
            "short_name": "6001",
            "lat": 45.51025293,
            "lon": -73.5567766,
            "capacity": 35,
            ...
        },
        ...
    ] */

// Get all stations status
gbfs.stationStatus()
    .then((stations) => console.log(stations));
    /* [
        {
            "station_id": "1",
            "num_bikes_available": 16,
            "num_ebikes_available": 3,
            "num_docks_available": 8,
            ...
        },
        ...
        ]
    } */


// Get system information
gbfs.systemInfo()
    .then((system) => console.log(system));
    /* {
         "system_id": "Bixi_MTL",
         "language": "en",
         "name": "Bixi_MTL",
         ...
    } */
```

### Single Station Data

For both `stationInfo()` and `stationStatus()`, retrieve data for a specific station by providing the `station_id`.

```typescript
gbfs.stationStatus("12").then((station) => console.log(station));
```

### Feed Language Management

To fetch data in a different language:

```typescript
// Change language for an existing object
gbfs.setPreferredFeedLanguage = "fr";

// Define language at creation
const gbfsInFrench = await Gbfs.create(autoDiscoveryURL, "fr");
```

To handle supported languages:

```typescript
gbfs.getSupportedLanguages(); // ['en', 'fr']
gbfs.isLanguageSupported("fr"); // true
```

## Compatibility

The current package is designed for ESModules. Future versions aim to include compatibility with CommonJS.

## API

### Gbfs class

| Method                      | Description                                                                                       | Parameters                                              | Returns                                            |
|-----------------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|
| create                      | Creates a new Gbfs object and initializes it with the autoDiscovery URL and an optional preferred language. | `autoDiscoveryURL: string`, `preferredLanguage?: string` | `Gbfs`                                              |
| setPreferredFeedLanguage    | Setter for the preferred feed language.                                                           | `language: string`                                      | `void`                                             |
| getPreferredFeedLanguage    | Getter for the preferred feed language.                                                           | None                                                    | `string`                                           |
| isLanguageSupported         | Checks if a language is supported by the GBFS system.                                             | `language: string`                                      | `boolean`                                          |
| getSupportedLanguages       | Getter for the supported languages array.                                                         | None                                                    | `string[]`                                         |
| stationInfo                 | Fetches station information.                                                                      | `stationId?: string`                                    | `Promise<StationInfo[] \| StationInfo>`            |
| stationStatus               | Fetches station status.                                                                           | `stationId?: string`                                    | `Promise<StationStatus[] \| StationStatus>`        |
| systemInfo                  | Fetches the general system information.                                                           | None                                                    | `Promise<SystemInfo>`                              |


## Contributing

We welcome contributions! Please see issues or pull requests on [GitHub](https://github.com/becaaye/gbfs-system).

## License

Licensed under the ISC license. See the [LICENSE file](https://github.com/becaaye/gbfs-system/blob/main/LICENSE) for details.

## Support

For bugs and feature requests, please use the [issues section on GitHub](https://github.com/becaaye/gbfs-system/issues).

## Contact

- **Becaye Badiane**
- [GitHub](https://github.com/becaaye)

import csvParser from "csv-parser";
import { System } from "./System";
import { GBFS_SYSTEM_CSV_URL } from  "../utils/constants";

/**
 * Finds nearby bike systems in a given city based on the client's location.
 */
export class Systems {
  private globalSystems: System[];

  private constructor(global: System[]) {
    this.globalSystems = global;
  }

  public static async initialize(): Promise<Systems> {
    try {
      // fetch global systems
      const response = await fetch(GBFS_SYSTEM_CSV_URL);
      const systemCSVRawBody = await response.text();

      // Convert CSV data System Objects
      const data = await this.convertCSVtoObjects(systemCSVRawBody);
      const instance = new Systems(data);
      return instance;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public get getAllSystems(): System[]{
    return this.globalSystems;
  }

  /**
   * Return all found systems in the given location (City)
   *
   * @param location - The city name to look for. exp : 'Paris'
   * @returns An array of found Systems in that location
   */
  public findByLocation(location: string): System[] {
    let foundSystems: System[] = [];
    try {
      if (location) {
        location = this.normalizeString(location);
        // this.globalSystems ?? this.getAllSystems();

        // Search for systems with the given location (city)
        foundSystems = this.globalSystems.filter((system: System) =>
          this.normalizeString(system.location).includes(location)
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return foundSystems;
  }

  /**
   * Return all found systems having the given country code parameter
   *
   * @param countryCode - The country code to look for. exp: 'CA'
   * @returns An array of found Systems in that country
   */
  public findByCountryCode(countryCode: string): System[] {
    let foundSystems: System[] = [];
    try {
      if (countryCode) {
        countryCode = this.normalizeString(countryCode);
        // this.globalSystems ?? this.getAllSystems();

        // Search for systems with the given countryCode
        foundSystems = this.globalSystems.filter(
          (system: System) =>
            this.normalizeString(system.countryCode) === countryCode
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return foundSystems;
  }

  /**
   * Returns a system having the given system ID parameter
   *
   * @param systemID - The systemID parameter to look for. exp: 'Bixi_MTL'
   * @returns a System object
   */
  public findBySystemID(systemID: string): System {
    let found: System[] = [];
    try {
      if (systemID) {
        // this.globalSystems ?? this.getAllSystems();
        found = this.globalSystems.filter(
          (system: System) => system.systemID === systemID
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (found.length > 1) {
      console.warn(
        "Warning: Multiple systems found with the given systemID. Returning the first one."
      );
    }
    return found[0];
  }

  /**
   * Return all found systems having the given name
   *
   * @param name - A name to look for. exp : 'Paris'
   * @returns An array of found Systems having that name
   */
  public findByName(name: string): System[] {
    let foundSystems: System[] = [];
    try {
      if (name) {
        name = this.normalizeString(name);
        // this.globalSystems ?? this.getAllSystems();

        // Search for systems with the given name (city)
        foundSystems = this.globalSystems.filter((system: System) =>
          this.normalizeString(system.name).includes(name)
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return foundSystems;
  }

  // /**
  //  * Fetch all registered systems in MobilityData's system catalog
  //  *
  //  * @returns An array of all Systems
  //  */
  // public getAllSystems(): System[] {
  //   try {
  //     if (!this.globalSystems) {
  //       // fetch global systems
  //       const response = await fetch(GBFS_SYSTEM_CSV_URL);
  //       const systemCSVRawBody = await response.text();

  //       // Convert CSV data System Objects
  //       this.globalSystems = await this.convertCSVtoObjects(systemCSVRawBody);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }

  //   // return data;
  //   return this.globalSystems;
  // }

  /**
   * Converts CSV data to JSON.
   *
   * @param csvData - The CSV data to convert.
   * @returns A promise that resolves to an array of System object (System[]) representing CSV data.
   */
  private static async convertCSVtoObjects(csvData: string): Promise<System[]> {
    try {
      return new Promise((resolve, reject) => {
        const results: System[] = [];

        const stream = csvParser({ separator: "," })
          .on("data", (data: object) => {
            results.push(new System(data));
          })
          .on("end", () => {
            resolve(results);
          })
          .on("error", (error: any) => {
            reject(error);
          });

        stream.end(csvData);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Normalizes a string by making it lowercase and removing accents.
   *
   * @param input - The input string to normalize.
   * @returns The normalized string.
   */
  private normalizeString(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
}

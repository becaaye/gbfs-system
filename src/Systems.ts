import axios from "axios";
import csvParser from "csv-parser";
import { CsvRow, ISystem } from "types.js";

/**
 * Get all registered gbfs systems and perform search using a known location, name, system Id or country code.
 */
export class Systems {
  public static GBFS_SYSTEM_CSV_URL =
    "https://raw.githubusercontent.com/MobilityData/gbfs/master/systems.csv";
  private globalSystems: ISystem[];

  private constructor(global: ISystem[]) {
    this.globalSystems = global;
  }

  /**
   * Fetch all registered systems and instanciate the Systems class
   * @returns {Systems} A new instance of the Systems class
   */
  public static async initialize(): Promise<Systems> {
    try {
      // fetch all registered systems
      const { data } = await axios.get<string>(this.GBFS_SYSTEM_CSV_URL);

      // Convert CSV raw data into ISystem Objects
      const systemCSVObjects = await this.convertCSVtoObjects(data);
      const instance = new Systems(systemCSVObjects);

      return instance;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Return all found systems in the given location (City)
   *
   * @returns {ISystem[]} An array of all registered systems found in the remote system.csv
   */
  public get getAllSystems(): ISystem[] {
    return this.globalSystems;
  }

  /**
   * Return all found systems in the given location (City)
   *
   * @param {string} location - The city name to look for. exp : 'Paris'
   * @returns An array of found Systems in that location
   */
  public findByLocation(location: string): ISystem[] {
    let foundSystems: ISystem[] = [];
    try {
      if (location) {
        location = this.normalizeString(location);

        // Search for systems with the given location (city)
        foundSystems = this.globalSystems.filter((operator: ISystem) =>
          this.normalizeString(operator.location).includes(location)
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
   * @param {string} countryCode - The country code to look for. exp: 'CA'
   * @returns An array of found Systems in that country
   */
  public findByCountryCode(countryCode: string): ISystem[] {
    let foundSystems: ISystem[] = [];
    try {
      if (countryCode) {
        countryCode = this.normalizeString(countryCode);

        // Search for systems with the given countryCode
        foundSystems = this.globalSystems.filter(
          (operator: ISystem) =>
            this.normalizeString(operator.countryCode) === countryCode
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
   * @param {string} systemID - The systemID parameter to look for. exp: 'Bixi_MTL'
   * @returns a System object
   */
  public findBySystemID(systemID: string): ISystem {
    let found: ISystem[] = [];
    try {
      if (systemID) {
        systemID = this.normalizeString(systemID);

        found = this.globalSystems.filter(
          (operator: ISystem) =>
            this.normalizeString(operator.systemID) === systemID
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
   * @param {string} name - A name to look for. exp : 'Paris'
   * @returns An array of found Systems having that name
   */
  public findByName(name: string): ISystem[] {
    let foundSystems: ISystem[] = [];
    try {
      if (name) {
        name = this.normalizeString(name);

        // Search for systems with the given name (city)
        foundSystems = this.globalSystems.filter((operator: ISystem) =>
          this.normalizeString(operator.name).includes(name)
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return foundSystems;
  }

  /**
   * Converts CSV raw data into an array of Objects.
   *
   * @param {string} csvData - The CSV data to convert.
   * @returns A promise that resolves to an array of System object (ISystem[]) representing CSV data.
   */
  private static async convertCSVtoObjects(
    csvData: string
  ): Promise<ISystem[]> {
    try {
      return new Promise((resolve, reject) => {
        const results: ISystem[] = [];

        const stream = csvParser({ separator: "," })
          .on("data", (data: CsvRow) => {
            const registeredOperator: ISystem = {
              countryCode: data["Country Code"],
              name: data["Name"],
              location: data["Location"],
              systemID: data["System ID"],
              url: data["URL"],
              autoDiscoveryURL: data["Auto-Discovery URL"],
              validationReport: data["Validation Report"],
            };

            results.push(registeredOperator);
          })
          .on("end", () => {
            resolve(results);
          })
          .on("error", (error: unknown) => {
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
   * @param {string} input - The input string to normalize.
   * @returns The normalized string.
   */
  private normalizeString(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
}

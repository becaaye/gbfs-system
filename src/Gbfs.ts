import axios from "axios";
import {
  GbfsResponse,
  FeedLanguage,
  Feed,
  StationInfo,
  StationInformationResponseObject,
  StationStatus,
  StationStatusResponseObject,
  SystemInfo,
  SystemInfoResponseObject,
} from "./types.js";

/**
 * Gbfs class provides methods to interact with a GBFS (General Bikeshare Feed Specification) compliant system.
 */
export class Gbfs {
  private autoDiscoveryURL: string;
  private preferredLanguage: string | undefined;
  private gbfsData: FeedLanguage | undefined;
  private gbfsSupportedLanguages: string[] | undefined;

  /**
   * Constructor for the Gbfs class.
   *
   * @param autoDiscoveryURL - The URL of the GBFS auto-discovery endpoint.
   * @param preferredLanguage - (Optional) The preferred language code for fetching GBFS data.
   */
  private constructor(autoDiscoveryURL: string, preferredLanguage?: string) {
    this.autoDiscoveryURL = autoDiscoveryURL;
    this.preferredLanguage = preferredLanguage;
  }

  /**
   * Factory method to create an instance of Gbfs and initialise the feed URLs
   *
   * @param autoDiscoveryURL - The URL of the GBFS auto-discovery endpoint.
   * @param preferredLanguage - (Optional) The preferred language code for fetching GBFS data.
   */
  static async create(
    autoDiscoveryURL: string,
    preferredLanguage?: string
  ): Promise<Gbfs> {
    const instance = new Gbfs(autoDiscoveryURL, preferredLanguage);
    await instance.ensureInitialized();
    return instance;
  }

  /**
   * Setter for the preferred feed language.
   *
   * @param language - The language code to set as the preferred language.
   */
  public set setPreferredFeedLanguage(language: string | undefined) {
    this.preferredLanguage = language;
  }

  /**
   * Getter for the preferred feed language.
   *
   * @returns The currently set preferred language code.
   */
  public get getPreferredFeedLanguage(): string | undefined {
    return this.preferredLanguage;
  }

  /**
   * Getter for the supported languages array.
   *
   * @returns The currently supported languages codes.
   */
  public getSupportedLanguages(): string[] | undefined {
    return this.gbfsSupportedLanguages;
  }

  /**
   * Checks if a language is supported by the GBFS system.
   *
   * @param language - The language code to check for support.
   * @returns True if the language is supported, false otherwise.
   */
  public isLanguageSupported(language: string): boolean {
    return this.gbfsSupportedLanguages?.includes(language) ?? false;
  }

  /**
   * Ensures the GBFS data is initialized by fetching data from the auto-discovery endpoint.
   */
  private async ensureInitialized(): Promise<void> {
    if (this.gbfsData && this.gbfsSupportedLanguages) return;
    try {
      const { data } = await axios.get<GbfsResponse>(this.autoDiscoveryURL, {
        timeout: 15000,
      });
      this.gbfsData = data.data;
      this.gbfsSupportedLanguages = Object.keys(this.gbfsData);
    } catch (error) {
      throw new Error(`Failed to initialize URLs: ${error}`);
    }
  }

  /**
   * Finds the URL of a specific feed.
   *
   * @param feedName - The name of the feed to find the URL for.
   * @returns The URL of the specified feed, or undefined if not found.
   */
  private async findFeedUrl(feedName: string): Promise<string | undefined> {
    try {
      await this.ensureInitialized();
      if (
        this.preferredLanguage &&
        !this.gbfsSupportedLanguages!.includes(this.preferredLanguage)
      ) {
        throw new Error(
          `The specified feed language '${
            this.preferredLanguage
          }' doesn't exist in that gbfs system. The available languages are : ${this.gbfsSupportedLanguages!.join(
            ", "
          )}`
        );
      }
      const feeds = this.preferredLanguage
        ? this.gbfsData![this.preferredLanguage].feeds
        : Object.values(this.gbfsData!)[0].feeds;
      return feeds?.find((feed: Feed) => feed.name === feedName)?.url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches data from a specified URL.
   *
   * @param url - The URL to fetch data from.
   * @returns The data fetched from the specified URL.
   */
  private async fetchData(url: string): Promise<unknown> {
    try {
      const { data } = await axios.get(url, { timeout: 15000 });
      return data;
    } catch (error) {
      throw new Error(`Failed to retrieve data from ${url}: ${error}`);
    }
  }

  /**
   * Gets data for a specified feed.
   *
   * @param feedName - The name of the feed to get data for.
   * @returns The data for the specified feed.
   */
  private async getFeedData(feedName: string): Promise<unknown> {
    const feedURL = await this.findFeedUrl(feedName);
    return this.fetchData(feedURL!);
  }

  /**
   * Fetches station information.
   *
   * @param stationId - (Optional) The ID of a specific station to fetch information for.
   * @returns An array of station information objects, or a single station information object if a stationId is provided.
   */
  async stationInfo(stationId?: string): Promise<StationInfo[] | StationInfo> {
    try {
      const {
        data: { stations },
      } = (await this.getFeedData(
        "station_information"
      )) as StationInformationResponseObject;
      if (stationId) {
        const station = stations.find(
          (station) => station.station_id === stationId
        );
        if (!station) {
          throw new Error(`Station with ID ${stationId} not found.`);
        }
        return station;
      }
      return stations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches station status.
   *
   * @param stationId - (Optional) The ID of a specific station to fetch status for.
   * @returns An array of station status objects, or a single station status object if a stationId is provided.
   */
  async stationStatus(
    stationId?: string
  ): Promise<StationStatus[] | StationStatus> {
    try {
      const {
        data: { stations },
      } = (await this.getFeedData(
        "station_status"
      )) as StationStatusResponseObject;
      if (stationId) {
        const station = stations.find(
          (station) => station.station_id === stationId
        );
        if (!station) {
          throw new Error(`Station with ID ${stationId} not found.`);
        }
        return station;
      }
      return stations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the general system information.
   *
   * @returns An object containing general information about the bike share system.
   */
  async systemInfo(): Promise<SystemInfo> {
    try {
      const { data } = (await this.getFeedData(
        "system_information"
      )) as SystemInfoResponseObject;
      if (!data.system_id)
        throw new Error("Unable to retrieve the system informations");
      return data;
    } catch (error) {
      throw error;
    }
  }
}

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
 * Get realtime feed data for a given GBFS (General Bikeshare Feed Specification) compliant system.
 * The feed must be already provided by the operator. exp : station_information, station_status, system_info, etc.
 * Visit MobiltyData website or github repo for more informations : https://github.com/MobilityData/gbfs
 */
export class Gbfs {
  private autoDiscoveryURL: string;
  private preferredFeedLanguage: string | undefined;
  private gbfsData: FeedLanguage | undefined;
  private gbfsSupportedLanguages: string[] | undefined;

  /**
   * Instanciate the Gbfs class.
   * @param autoDiscoveryURL - The URL of the GBFS auto-discovery endpoint.
   * @param preferredFeedLanguage - [Optional] The preferred language code for fetching GBFS data.
   * @returns A new instance of the Gbfs class.
   */
  private constructor(
    autoDiscoveryURL: string,
    preferredFeedLanguage?: string
  ) {
    this.autoDiscoveryURL = autoDiscoveryURL;
    this.preferredFeedLanguage = preferredFeedLanguage;
  }

  /**
   * Create an instance of Gbfs and retrieve all found feeds URLs
   * @param {string} autoDiscoveryURL - The URL of the GBFS system.
   * That URL can be found in the operator API documentation, or by checking the MobilityData maintained system.csv.
   * The {Systems} module of this library also provide a way to get the autoDiscoveryURL for a registered operator.
   * @param {string} preferredFeedLanguage - [Optional] - The language code you want to get the feeds data from.
   * Some operators provide their gbfs system in multiple languages depending on their public's needs.
   * @
   */
  static async initialize(
    autoDiscoveryURL: string,
    preferredFeedLanguage?: string
  ): Promise<Gbfs> {
    const instance = new Gbfs(autoDiscoveryURL, preferredFeedLanguage);
    await instance.ensureInitialized();
    return instance;
  }

  /**
   * Get the current defined preferred feed language.
   * @param language - The language code to set as the preferred feed language.
   */
  public set setPreferredFeedLanguage(language: string) {
    this.preferredFeedLanguage = language;
  }

  /**
   * Getter for the preferred feed language.
   *
   * @returns The currently set preferred language code.
   */
  public get getPreferredFeedLanguage(): string | undefined {
    return this.preferredFeedLanguage;
  }

  /**
   * Get all supported feed languages.
   * @returns An array of all feeds languages found for the current gbfs system. // ['en', 'fr']
   */
  public getSupportedLanguages(): string[] | undefined {
    return this.gbfsSupportedLanguages;
  }

  /**
   * Checks if a given language is supported by the GBFS system.
   * @param language - The language code to check for support. exp: 'en'
   * @returns True if the language is supported.
   */
  public isLanguageSupported(language: string): boolean {
    return this.gbfsSupportedLanguages?.includes(language) ?? false;
  }

  /**
   * Ensures the GBFS data is properly initialized and all required data stored.
   * @returns {void}
   */
  private async ensureInitialized(): Promise<void> {
    if (this.gbfsData && this.gbfsSupportedLanguages) return;
    try {
      const { data } = await axios.get<GbfsResponse>(this.autoDiscoveryURL, {headers:{'Content-Type': 'application/json'}});
      this.gbfsData = data.data;
      this.gbfsSupportedLanguages = Object.keys(this.gbfsData);
    } catch (error) {
      throw new Error(`Failed to initialize URLs: ${error}`);
    }
  }

  /**
   * Finds the URL of a specific feed.
   * @param {string} feedName - The name of the feed to find the URL for.
   * @returns The URL of the specified feed or undefined if not found.
   * If there's no defined preferred feed language, it uses the first found feed object to process.
   */
  private async findFeedUrl(feedName: string): Promise<string | undefined> {
    try {
      await this.ensureInitialized();
      if (
        this.preferredFeedLanguage &&
        !this.gbfsSupportedLanguages!.includes(this.preferredFeedLanguage)
      ) {
        throw new Error(
          `The specified feed language '${
            this.preferredFeedLanguage
          }' doesn't exist in that gbfs system. The available languages are : ${this.gbfsSupportedLanguages!.join(
            ", "
          )}`
        );
      }
      const feeds = this.preferredFeedLanguage
        ? this.gbfsData![this.preferredFeedLanguage].feeds
        : Object.values(this.gbfsData!)[0].feeds;
      return feeds?.find((feed: Feed) => feed.name === feedName)?.url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches data from a specified URL.
   * @param {string} url - The URL to fetch data from.
   * @returns {Promise<unknown>} The data fetched from the specified URL.
   */
  private async fetchData(url: string): Promise<unknown> {
    try {
      const { data } = await axios.get<unknown>(url, {headers:{'Content-Type': 'application/json'}});
      return data;
    } catch (error) {
      throw new Error(`Failed to retrieve data from ${url}: ${error}`);
    }
  }

  /**
   * Gets data for a specified feed.
   * @param {string} feedName - The name of the feed to get data for.
   * @returns {Promise<unknown>} The data for the specified feed.
   */
  private async getFeedData(feedName: string): Promise<unknown> {
    const feedURL = await this.findFeedUrl(feedName);
    return this.fetchData(feedURL!);
  }

  /**
   * Fetches station_informations feed realtime data.
   * @returns An object of station_informations data for all stations.
   */
  async stationInfo(): Promise<StationInfo[]>;

  /**
   * Fetches station_informations feed realtime data.
   * @param stationId - The ID of the station to fetch station_informations data for.
   * @returns The station_informations data of the found station.
   */
  async stationInfo(stationId: string): Promise<StationInfo>;

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
   * Fetches station_status feed realtime data.
   * @returns An array of station_status data for all stations.
   */
  async stationStatus(): Promise<StationStatus[]>;

  /**
   * Fetches station_status feed realtime data.
   * @param stationId - The ID of the station to fetch station_status data for.
   * @returns The station_status data of the found station.
   */
  async stationStatus(stationId: string): Promise<StationStatus>;

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
   * Fetches system_information feed data.
   * @returns The system_information feed data as an object.
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

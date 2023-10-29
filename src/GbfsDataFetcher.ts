import axios from "axios";

export class Gbfs {
  private autoDiscoveryURL: string;
  private preferredLanguage: string | undefined;
  private gbfsData: FeedLanguage | undefined;
  private gbfsAvailableLanguages: string[] | undefined;

  constructor(autoDiscoveryURL: string, preferredLanguage?: string) {
    this.autoDiscoveryURL = autoDiscoveryURL;
    this.preferredLanguage = preferredLanguage;
    this.ensureInitialized();
  }

  public set setPreferredFeedLanguage(language: string | undefined) {
    this.preferredLanguage = language;
  }

  public get getPreferredFeedLanguage(): string | undefined {
    return this.preferredLanguage;
  }

  public isLanguageSupported(language: string): boolean {
    return this.gbfsAvailableLanguages?.includes(language) ?? false;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.gbfsData && this.gbfsAvailableLanguages) return;
    try {
      const { data } = await axios.get<GbfsResponse>(this.autoDiscoveryURL, {
        timeout: 5000,
      });
      this.gbfsData = data.data;
      this.gbfsAvailableLanguages = Object.keys(this.gbfsData);
    } catch (error) {
      throw new Error(`Failed to initialize URLs: ${error}`);
    }
  }

  private async findFeedUrl(feedName: string): Promise<string | undefined> {
    await this.ensureInitialized();
    if (
      this.preferredLanguage &&
      !this.gbfsAvailableLanguages!.includes(this.preferredLanguage)
    ) {
      throw new Error(
        `The specified feed language "${
          this.preferredLanguage
        }" doesn't exist in that gbfs system. The available languages are : ${this.gbfsAvailableLanguages!.join(
          ", "
        )}`
      );
    }
    const feeds = this.preferredLanguage
      ? this.gbfsData![this.preferredLanguage].feeds
      : Object.values(this.gbfsData!)[0].feeds;
    return feeds?.find((feed: Feed) => feed.name === feedName)?.url;
  }

  private async fetchData(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      return data;
    } catch (error) {
      throw new Error(`Failed to retrieve data from ${url}: ${error}`);
    }
  }

  private async getFeedData(feedName: string): Promise<any> {
    const feedURL = await this.findFeedUrl(feedName);
    return this.fetchData(feedURL!);
  }

  async stationInfo(stationId?: string): Promise<StationInfo[] | StationInfo> {
    const {
      data: { stations },
    } = (await this.getFeedData(
      "station_information"
    )) as StationInformationResponseObject;
    return stationId
      ? stations.find((station) => station.station_id === stationId) ||
          Promise.reject(`Station with ID ${stationId} not found.`)
      : stations;
  }

  async stationStatus(
    stationId?: string
  ): Promise<StationStatus[] | StationStatus> {
    const {
      data: { stations },
    } = (await this.getFeedData(
      "station_status"
    )) as StationStatusResponseObject;
    return stationId
      ? stations.find((station) => station.station_id === stationId) ||
          Promise.reject(`Station with ID ${stationId} not found.`)
      : stations;
  }

  async systemInfo(): Promise<SystemInfo> {
    const { data } = (await this.getFeedData(
      "system_information"
    )) as SystemInfoResponseObject;
    if (!data.system_id) throw new Error("System ID not found in the data.");
    return data;
  }
}

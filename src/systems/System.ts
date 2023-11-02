export class System implements ISystem {
  countryCode: string;
  name: string;
  location: string;
  systemID: string;
  url: string;
  autoDiscoveryURL: string;
  validationReport: string;

  constructor(data: any) {
    this.countryCode = data["Country Code"];
    this.name = data["Name"];
    this.location = data["Location"];
    this.systemID = data["System ID"];
    this.url = data["URL"];
    this.autoDiscoveryURL = data["Auto-Discovery URL"];
    this.validationReport = data["Validation Report"];
  }
}

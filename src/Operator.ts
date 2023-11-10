import { IOperator } from "./types.js";

export class Operator implements IOperator {
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
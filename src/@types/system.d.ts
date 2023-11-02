/**
 * Represents an system retrieved from the GBFS system data.
 */
interface ISystem {
  countryCode: string;
  name?: string;
  location: string;
  systemID: string;
  url?: string;
  autoDiscoveryURL: string;
  validationReport?: string;
}

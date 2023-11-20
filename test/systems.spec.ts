import { Systems } from "../src/Systems";
import { ISystem } from "../src/types.js";

describe("Systems class", () => {
  let globalSystems: Systems;

  const systemMock: ISystem = {
    countryCode: "CA",
    name: "BIXI Montréal",
    location: "Montréal, CA",
    systemID: "Bixi_MTL",
    url: "https://www.bixi.com/",
    autoDiscoveryURL: "https://gbfs.velobixi.com/gbfs/gbfs.json",
    validationReport:
      "https://gbfs-validator.netlify.app/?url=https%3A%2F%2Fgbfs.velobixi.com%2Fgbfs%2Fgbfs.json",
  };

  beforeEach(async () => {
    globalSystems = await Systems.initialize();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get all systems worldwide, at least 800 sytems", () => {
    expect(globalSystems.getAllSystems.length).toBeGreaterThan(800);
  });

  it("Systems objects should have the right properties", () => {
    globalSystems.getAllSystems.forEach((operator) => {
      expect(operator).toMatchObject<ISystem>({
        countryCode: expect.any(String),
        name: expect.any(String),
        location: expect.any(String),
        systemID: expect.any(String),
        url: expect.any(String),
        autoDiscoveryURL: expect.any(String),
        // validationReport: expect.toBeStringOrUndefined(),
      });
    });
  });

  if (systemMock.location) {
    it("should find the right system by their location", () => {
      const foundSystems = globalSystems.findByLocation(systemMock.location);
      foundSystems?.forEach((system) =>
        expect(system.location.includes(systemMock.location)).toBeTruthy()
      );
    });
  }

  if (systemMock.countryCode) {
    it("should find the right systems with their country code", () => {
      const foundSystems = globalSystems.findByCountryCode(
        systemMock.countryCode
      );
      if (foundSystems) {
        foundSystems.forEach((system) =>
          expect(system.countryCode).toBe(systemMock.countryCode)
        );
      }
    });
  }

  if (systemMock.systemID) {
    it("should find the right system with its system ID", () => {
      const foundSystem = globalSystems.findBySystemID(systemMock.systemID);
      expect(foundSystem).toMatchObject<ISystem>(foundSystem);
      expect(foundSystem.systemID).toBe(systemMock.systemID);
    });
  }

  if (systemMock.name) {
    it("should find systems having a given name", () => {
      const foundSystems = globalSystems.findByName(systemMock.name);
      foundSystems?.forEach((system) =>
        expect(system.name.includes(systemMock.name)).toBeTruthy()
      );
    });
  }
});

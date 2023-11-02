import { Systems } from "../src/systems/Systems";
import { System } from "../src/systems/System";

describe("Systems class", () => {
  let globalSystems: Systems;

  const systemMock = {
    countryCode: "CA",
    name: "BIXI Montréal",
    location: "Montréal, CA",
    systemID: "Bixi_MTL",
    url: "https://www.bixi.com/",
    autoDiscoveryURL: "https://gbfs.velobixi.com/gbfs/gbfs.json"
  };

  beforeEach(async () => {
    globalSystems =  await Systems.initialize();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get all systems worldwide, at least 800 sytems", () => {
    expect(globalSystems.getAllSystems.length).toBeGreaterThan(800);
  });

  it("Systems objects should have the right properties", () => {
    globalSystems.getAllSystems.forEach(system => 
        expect(system).toMatchObject<System>({
            countryCode: expect.any(String),
            name: expect.any(String),
            location: expect.any(String),
            systemID: expect.any(String),
            url: expect.any(String),
            autoDiscoveryURL: expect.any(String),
            validationReport: expect.any(String),
        })
    );
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
      const foundSystems = globalSystems.findByCountryCode(systemMock.countryCode);
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
      expect(foundSystem).toBeInstanceOf(System);
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

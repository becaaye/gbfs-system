import { Gbfs } from "../src/gbfs/Gbfs";
import { Systems } from "../src/systems/Systems";

describe("testing interoperability between Gbfs and Systems modules", () => {
  const systemID = "bike_share_toronto";

  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("testing interoperability between the Gbfs and the Systems modules", async () => {
    const SYSTEMS = await Systems.initialize();
    const system = SYSTEMS.findBySystemID(systemID);

    const GBFS = await Gbfs.create(system.autoDiscoveryURL);
    const systemInfo = await GBFS.systemInfo();

    expect(systemInfo.language).toBe('en');
    expect(systemInfo.timezone).toBe('America/Toronto');
    
  });

});

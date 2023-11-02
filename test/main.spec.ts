import { Gbfs } from '../src/gbfs/Gbfs';
import { Systems } from '../src/systems/Systems';

describe('testing Gbfs and System classes', () => {
  

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get a system by using his systemID, and his fetch system_informations feed", async() => {
    const SYSTEMS = await Systems.initialize();
    const system = SYSTEMS.findBySystemID('bike_share_toronto');

    const GBFS = await Gbfs.create(system.autoDiscoveryURL);
    const systemInfo = await GBFS.systemInfo();

    console.log(systemInfo);
  });

});
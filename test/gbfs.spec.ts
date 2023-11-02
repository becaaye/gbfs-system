import { Gbfs } from '../src/gbfs/Gbfs';

describe('Gbfs class', () => {
  let gbfs: Gbfs;
  const autoDiscoveryURL = 'https://gbfs.velobixi.com/gbfs/gbfs.json';
  const preferredLanguage = 'fr';
  const stationId = '514';

  beforeEach(async () => {
    gbfs = await Gbfs.create(autoDiscoveryURL);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  if (preferredLanguage) {
    it('should set preferred language properly', () => {
      gbfs.setPreferredFeedLanguage = preferredLanguage;
      expect(gbfs.getPreferredFeedLanguage).toBe(preferredLanguage);
    });
  }

  it('should get an array of the supported languages', () => {
    expect(gbfs.getSupportedLanguages()).toMatchObject(['en','fr']);
  });

  it('should return true if the passed parameter language is supported', () => {
    expect(gbfs.isLanguageSupported(preferredLanguage)).toBeTruthy();
  });

  it('should fetch station information', async () => {
    const result = await gbfs.stationInfo(stationId);
    expect(result).toMatchObject({
      station_id: expect.any(String),
      name: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
    });
  });

  it('should fetch station status', async () => {
    const result = await gbfs.stationStatus(stationId);
    expect(result).toMatchObject({
      station_id: expect.any(String),
      num_docks_available: expect.any(Number),
      is_installed: expect.any(Number),
      is_charging: expect.any(Boolean),
    });
  });

  it('should fetch system information', async () => {
    const result = await gbfs.systemInfo();
    expect(result).toMatchObject({
      system_id: expect.any(String),
      language: expect.any(String),
      name: expect.any(String),
    });
  });
});

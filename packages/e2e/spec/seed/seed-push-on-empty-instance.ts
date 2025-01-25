import { Context, debug, getAllItems, info } from '../helpers/index.js';

export const seedPushOnEmptyInstance = (context: Context) => {
  it('seed diff and push on an empty instance', async () => {
    // Init sync client
    const sync = await context.getSync('sources/seed-basic');
    const directus = context.getDirectus();
    const client = directus.get();

    // Push schema first
    await sync.push();

    // Check differences for seeds
    const diffOutput = await sync.seedDiff();

    // --------------------------------------------------------------------------
    // Check differences for each collection
    expect(diffOutput).toContain(info('[country] To create: 3 item(s)'));
    expect(diffOutput).toContain(debug('[country] To update: 0 item(s)'));
    expect(diffOutput).toContain(debug('[country] To delete: 0 item(s)'));
    expect(diffOutput).toContain(debug('[country] Unchanged: 0 item(s)'));

    expect(diffOutput).toContain(info('[language] To create: 3 item(s)'));
    expect(diffOutput).toContain(debug('[language] To update: 0 item(s)'));
    expect(diffOutput).toContain(debug('[language] To delete: 0 item(s)'));
    expect(diffOutput).toContain(debug('[language] Unchanged: 0 item(s)'));

    expect(diffOutput).toContain(info('[city] To create: 4 item(s)'));
    expect(diffOutput).toContain(debug('[city] To update: 0 item(s)'));
    expect(diffOutput).toContain(debug('[city] To delete: 0 item(s)'));
    expect(diffOutput).toContain(debug('[city] Unchanged: 0 item(s)'));

    expect(diffOutput).toContain(
      info('[country_language] To create: 3 item(s)'),
    );
    expect(diffOutput).toContain(
      debug('[country_language] To update: 0 item(s)'),
    );
    expect(diffOutput).toContain(
      debug('[country_language] To delete: 0 item(s)'),
    );
    expect(diffOutput).toContain(
      debug('[country_language] Unchanged: 0 item(s)'),
    );

    // --------------------------------------------------------------------------
    // Push data seeds to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.seedPush();

    // --------------------------------------------------------------------------
    // Check that activities have been created
    const activities = await directus.getActivities(beforePushDate);

    const createdCountries = activities.filter(
      (a) => a.action === 'create' && a.collection === 'country',
    );
    expect(createdCountries.length).toEqual(3);

    const createdLanguages = activities.filter(
      (a) => a.action === 'create' && a.collection === 'language',
    );
    expect(createdLanguages.length).toEqual(3);

    const createdCities = activities.filter(
      (a) => a.action === 'create' && a.collection === 'city',
    );
    expect(createdCities.length).toEqual(4);

    const createdCountryLanguages = activities.filter(
      (a) => a.action === 'create' && a.collection === 'country_language',
    );
    expect(createdCountryLanguages.length).toEqual(3);

    // --------------------------------------------------------------------------
    // Analyze output
    expect(pushOutput).toContain(info('[country] Created 3 items'));
    expect(pushOutput).toContain(debug('[country] Updated 0 items'));
    expect(pushOutput).toContain(debug('[country] Deleted 0 items'));

    expect(pushOutput).toContain(info('[language] Created 3 items'));
    expect(pushOutput).toContain(debug('[language] Updated 0 items'));
    expect(pushOutput).toContain(debug('[language] Deleted 0 items'));

    expect(pushOutput).toContain(info('[city] Created 4 items'));
    expect(pushOutput).toContain(debug('[city] Updated 0 items'));
    expect(pushOutput).toContain(debug('[city] Deleted 0 items'));

    expect(pushOutput).toContain(info('[country_language] Created 3 items'));
    expect(pushOutput).toContain(debug('[country_language] Updated 0 items'));
    expect(pushOutput).toContain(debug('[country_language] Deleted 0 items'));

    // --------------------------------------------------------------------------
    // Check that the items have been created
    const countries = await getAllItems(client, 'country');
    expect(countries.length).toEqual(3);

    const languages = await getAllItems(client, 'language');
    expect(languages.length).toEqual(3);

    const cities = await getAllItems(client, 'city');
    expect(cities.length).toEqual(4);

    const countryLanguages = await getAllItems(client, 'country_language');
    expect(countryLanguages.length).toEqual(3);

    // --------------------------------------------------------------------------
    // Ensure that sync id maps have been created and contain the ids of the items
    const countryIdMaps = await directus.getSyncIdMapsForSeed('country');
    expect(countryIdMaps.length).toEqual(3);
    for (const country of countries) {
      expect(
        countryIdMaps.find((m) => m.local_id === country.id.toString()),
      ).toBeDefined();
    }

    const languageIdMaps = await directus.getSyncIdMapsForSeed('language');
    expect(languageIdMaps.length).toEqual(3);
    for (const language of languages) {
      expect(
        languageIdMaps.find((m) => m.local_id === language.code.toString()),
      ).toBeDefined();
    }

    const cityIdMaps = await directus.getSyncIdMapsForSeed('city');
    expect(cityIdMaps.length).toEqual(4);
    for (const city of cities) {
      expect(
        cityIdMaps.find((m) => m.local_id === city.id.toString()),
      ).toBeDefined();
    }

    const countryLanguageIdMaps =
      await directus.getSyncIdMapsForSeed('country_language');
    expect(countryLanguageIdMaps.length).toEqual(3);
    for (const countryLanguage of countryLanguages) {
      expect(
        countryLanguageIdMaps.find(
          (m) => m.local_id === countryLanguage.id.toString(),
        ),
      ).toBeDefined();
    }
  });
};

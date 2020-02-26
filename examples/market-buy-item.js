const { Tarkov } = require('tarkov');

// We can either provide a pre-generated hwid, or not pass it to Tarkov() for a randomly generated one
const hwid = 'awesome-sick-hwid';
const t = new Tarkov(hwid);

// Run everything in an async function
(async () => {

  // Login to tarkov, optionally also pass 2 factor code as a third param
  await t.login('email@email.com', 'password');

  // Load all profiles we have
  const profiles = await t.getProfiles();

  // For this example, we're just going to grab the second profile
  const profile = await t.selectProfile(profiles[1]);

  // Load our i18n translations
  await t.getI18n('en');

  // Search for an item
  const search = await t.searchMarket(0, 50, {
    sortType: 5,
    sortDirection: 0,
    currency: 0, // All currencies
    handbookId: '5c94bbff86f7747ee735c08f', // Labs Access Keycard
  });

  // Buy the first offer (lowest price);
  search.offers[0].buyWithRoubles(1);
})();

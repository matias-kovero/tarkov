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

  // Load all traders
  const traders = await t.getTraders();

  // Let's get therapist from our array of traders
  const therapist = t.find(t => t._id === '54cb57776803fa99248b456e');

  // Get a list of items this trader sells.
  const items = therapist.getItems();

  console.log(items);
})();

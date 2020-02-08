# Tarkov &middot; [![NPM](https://img.shields.io/npm/l/tarkov?color=blue&style=plastic)](https://github.com/matias-kovero/tarkov/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/tarkov?color=blue&style=plastic)](https://www.npmjs.com/package/tarkov) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=plastic)](https://github.com/matias-kovero/tarkov/pulls)
A npm library for the [Escape from Tarkov](https://escapefromtarkov.com) API.
This library is currently in alpha. Everything may change significantly in future releases.
## Features
- [x] Authentication
- [x] Flea market
- [x] Traders
- [ ] Hideout
- [ ] Inventory management (equip, move, delete, etc)
- [ ] Messenger
- [ ] Quests

## Install
```
npm i tarkov
```
  
### Hardware ID
Hardware ID (HWID) may be required on authentication, it can either be sniffed from the EFT launcher or generated. It's recommended to save the HWID and reuse it after the first successful authentication.

## _"Unofficial"_
I should emphasize that this library is _unofficial_. EFT does not have a public API, everything in this repo was reversed from the game.

The API is clearly designed for internal use. It contains numerous spelling mistakes, inconsistent conventions, and tons of bad practice JSON. The developers may push breaking changes without prior warning.
## License
[MIT](LICENSE)
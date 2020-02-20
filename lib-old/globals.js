// main libraries
global.request  = require('request-promise-native');
global.pako     = require('pako');
global.crypto   = require('crypto');
//=====================================================
// global variables
global.GAME_VERSION       = '0.12.3.5834'; // should be auto updated
global.LAUNCHER_VERSION   = '0.9.3.1023'; // should be auto updated
global.LAUNCHER_ENDPOINT  = "launcher.escapefromtarkov.com"; 	// launcher backend
global.PROD_ENDPOINT      = "prod.escapefromtarkov.com";		// game backend
global.TRADING_ENDPOINT   = "trading.escapefromtarkov.com";	// trading backend
global.RAGFAIR_ENDPOINT   = "ragfair.escapefromtarkov.com";	// ragfair backend
global.UNITY_VERSION      = '2018.4.13f1'; // take in mind to update time to time
global.LOCAL_STRINGS      = {}; // i18n localizations strings
global.REQUEST_ID         = 1; // Pl0x no bannerino
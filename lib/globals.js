// main libraries
global.request 	= require('request-promise-native');
global.pako     = require('pako');
global.crypto   = require('crypto');
//=====================================================
// global variables
global.GAME_VERSION 		  = '0.12.3.5776'; // should be auto updated
global.LAUNCHER_VERSION 	= '0.9.2.970'; // should be auto updated
global.UNITY_VERSION 		  = '2018.4.13f1'; // this need to be empty it will updated by script
global.LAUNCHER_ENDPOINT 	= "launcher.escapefromtarkov.com"; 	// launcher backend
global.PROD_ENDPOINT 			= "prod.escapefromtarkov.com";		// game backend
global.TRADING_ENDPOINT 	= "trading.escapefromtarkov.com";	// trading backend
global.RAGFAIR_ENDPOINT 	= "ragfair.escapefromtarkov.com";	// ragfair backend
global.USER_AGENT 	    	= 'UnityPlayer/2018.4.13f1 (UnityWebRequest/1.0, libcurl/7.52.0-DEV)'; // take that in mind to update it from time to time
global.UNITY_VERSION      = '2018.4.13f1'; // take in mind to update time to time
global.LOCAL_STRINGS      = {}; // i18n localizations strings
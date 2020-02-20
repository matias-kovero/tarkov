import got, { Got } from 'got';
import pako = require('pako');
import { ExtendOptions, NormalOptions } from '../types/api';

export class Api {
  public prod: Got;
  public launcher: Got;
  public trading: Got;
  public ragfair: Got;

  public launcherVersion = '0.9.3.1023';
  public gameVersion = '0.12.3.5985';
  public unityVersion = '2018.4.13f1';

  private request = 0;

  public session = {
    queued: false,
    session: '',
  };

  private defaultOptions: ExtendOptions = {
    encoding: undefined,
    decompress: true,
    responseType: 'buffer',
    hooks: {
      beforeRequest: [
        (options: NormalOptions) => {
          // redefine out user-agent for this request
          options.bsgAgent ? options.headers['user-agent'] = `BSG Launcher ${this.launcherVersion}` : null;
          options.unityAgent ? options.headers['user-agent'] = `UnityPlayer/${this.unityVersion} (UnityWebRequest/1.0, libcurl/7.52.0-DEV)` : null;
          options.unityAgent ? options.headers['x-unity-version'] = this.unityVersion : null;
          options.appVersion ? options.headers['app-version'] = `EFT Client ${this.gameVersion}` : null;
          options.requestId ? options.headers['gclient-requestid'] = `${this.request++}` : null;
        },
      ],
      afterResponse: [
        (response: any, retry: any) => {
          response = {
            ...response,
            body: JSON.parse(pako.inflate(response.body, { to: 'string' })),
          };

          if (response.body.err !== 0) {
            throw response.body;
          };

          return response;
        }
      ]
    }
  };

  constructor() {
    this.prod = got.extend({
      prefixUrl: 'https://prod.escapefromtarkov.com',
      headers: {
        'content-type': 'application/json',
      },
      unityAgent: true,
      appVersion: true,
      requestId: true,
      ...this.defaultOptions,
    });

    this.launcher = got.extend({
      prefixUrl: 'https://launcher.escapefromtarkov.com',
      headers: {
        'content-type': 'application/json',
      },
      bsgAgent: true,
      ...this.defaultOptions,
    });

    this.trading = got.extend({
      prefixUrl: 'https://trading.escapefromtarkov.com',
      headers: {
        'content-type': 'application/json',
      },
      ...this.defaultOptions,
    });

    this.ragfair = got.extend({
      prefixUrl: 'https://ragfair.escapefromtarkov.com',
      headers: {
        'content-type': 'application/json',
      },
      ...this.defaultOptions,
    });

    // Load the latest launcher version
    this.getLauncherVersion();
    this.getGameVersion();
  }

  /**
   * Loads the latest launcher version into memory
   */
  private async getLauncherVersion() {
    this.launcher.post('launcher/GetLauncherDistrib')
      .then((result: any) => {
        const { Version } = result.body.data;

        if (this.launcherVersion !== Version) {
          console.log(`Updated launcher version from ${this.launcherVersion} to ${Version}`);
          this.launcherVersion = Version;
        }
      }, error => {
        throw error;
      });
  }

  private async getGameVersion() {
    this.launcher.post('launcher/GetPatchList', {
      searchParams: {
        launcherVersion: this.launcherVersion,
        branch: 'live',
      },
    })
      .then((result: any) => {
        const { Version } = result.body.data[0];

        if (this.gameVersion !== Version) {
          console.log(`Updated game version from ${this.gameVersion} to ${Version}`);
          this.gameVersion = Version;
        }
      }, error => {
        throw error;
      });
  }
}
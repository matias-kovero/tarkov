import got, { Got, NormalizedOptions, Options } from 'got';
import pako = require('pako');

interface ExtendOptions extends Options {
  bsgAgent?: boolean;
}

interface NormalOptions extends NormalizedOptions {
  bsgAgent?: boolean;
}

export interface ApiError {
  err: number;
  errmsg: string;
}

export class Api {
  
  public prod: Got;
  public launcher: Got;
  public trading: Got;
  public ragfair: Got;

  public launcherVersion = '0.9.3.1023';
  public gameVersion = '0.12.3.5961';

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
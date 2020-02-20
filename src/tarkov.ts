import { Hwid } from "./tarkov.interface";
import { Api } from "./api";
import * as crypto from 'crypto';

/** Tarkov API Wrapper */
export class Tarkov {
  private hwid: Hwid; // Users HWID
  private api: Api; // Our HTTP Client for making requests

  constructor(hwid?: Hwid) {
    // Use the provided hwid or generate one
    this.hwid = hwid || this.generateHwid();

    // Setup our API
    this.api = new Api();

    console.log(` > Initialized Tarkov API Wrapper`);
    console.log(` > HWID: ${this.hwid}`);
    console.log(` > Launcher Version: ${this.launcherVersion}`);
    console.log(` > Game Version: ${this.gameVersion}`);
  }

  /*
   * Getter/Setters
   */

  get launcherVersion() {
    return this.api.launcherVersion;
  }

  get gameVersion() {
    return this.api.gameVersion;
  }

  get session() {
    return this.api.session;
  }

  set session(session) {
    this.api.session = session;
  }

  /*
   * Public Functions
   */

  /**
   * Login to tarkov
   * @param {string} email Your Tarkov account email
   * @param {string} password Your Tarkov account password
   */
  public login(email: string, password: string) {
    const hash = crypto.createHash('md5').update(password).digest('hex');

    const body = JSON.stringify({
      email,
      pass: hash,
      hwCode: this.hwid,
      captcha: null, 
    });

    this.api.launcher.post('launcher/login', {
      searchParams: {
        launcherVersion: this.launcherVersion,
        branch: 'live',
      },
      body,
    }).then((result: any) => {
      if (result.statusCode === 200) {
        this.exchangeAccessToken(result.body.data.access_token);
      } else {
        throw `Invalid status code ${result.statusCode}`;
      }
    }, error => {
      throw error;
    });
  }

  /*
   * Private Functions
   */

  /**
   * Exchanges the access token for a session id
   * @param {string} access_token JWT from @see login
   */
  private exchangeAccessToken(access_token: string) {
    const body = JSON.stringify({
      version: {
        major: this.gameVersion,
        game: 'live',
        backend: '6'
      },
      hwCode: this.hwid,
    });

    this.api.prod.post('launcher/game/start', {
      searchParams: {
        launcherVersion: this.launcherVersion,
        branch: 'alive',
      },
      headers: {
        Host: 'prod.escapefromtarkov.com',
        'Authorization': access_token,
      },
      body,
    }).then((result: any) => {
      if (result.statusCode === 200) {
        this.session = result.body.data;
        console.log('New session started!', this.session);
      } else {
        throw `Invalid status code ${result.statusCode}`;
      }
    }, error => {
      throw error;
    });
  }

  // TODO: move this to a HWID class
  private generateHwid(): Hwid {
    const random_hash = () => {
      let hash = crypto.createHash('sha1').update(Math.random().toString()).digest('hex');
      return hash;
    }

    const short_hash = () => {
      let hash = random_hash();
      return hash.substring(0, hash.length - 8);
    }
  
    return `#1-${random_hash()}:${random_hash()}:${random_hash()}-${random_hash()}-${random_hash()}-${random_hash()}-${random_hash()}-${short_hash()}`;
  }
}
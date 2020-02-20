import { Api } from "./api";
import * as crypto from 'crypto';

import { Profile } from "../types/profile";
import { ApiResponse } from "../types/api";
import { Hwid } from "../types/tarkov";

/** Tarkov API Wrapper */
export class Tarkov {
  private hwid: Hwid; // Users HWID
  private api: Api; // Our HTTP Client for making requests
  profiles: Profile[] = [];

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
   * @param {string} [twoFactor] 2FA Code sent to your account email
   */
  public async login(email: string, password: string, twoFactor?: string) {
    const hash = crypto.createHash('md5').update(password).digest('hex');

    if (twoFactor !== undefined) {
      try {
        await this.activateHardware(email, twoFactor);
      } catch ({ err, errmsg }) {
        return console.error(`[API Error] ${errmsg}`);
      }
    }

    const body = JSON.stringify({
      email,
      pass: hash,
      hwCode: this.hwid,
      captcha: null, 
    });

    try {
      const result: ApiResponse = await this.api.launcher.post('launcher/login', {
        searchParams: {
          launcherVersion: this.launcherVersion,
          branch: 'live',
        },
        body,
      });

      if (result.body.err === 0) {
        await this.exchangeAccessToken(result.body.data.access_token);
        return;
      }

      console.error(`[API Error] ${result.body.errmsg}`);
      return result.body;
    } catch (error) {
      console.log('[Login] ', error);
    }
  }

  /**
   * Get an array of profiles
   */
  public async getProfiles(): Promise<Profile[]> {
    const result: ApiResponse<Profile[]> = await this.api.prod.post('client/game/profile/list', {
      headers: {
        cookie: `PHPSESSID=${this.session.session}`,
      },
    });

    this.profiles = result.body.data;

    return this.profiles;
  }

  /*
   * Private Functions
   */

  /**
   * Exchanges the access token for a session id
   * @param {string} access_token JWT from @login
   */
  private async exchangeAccessToken(access_token: string) {
    const body = JSON.stringify({
      version: {
        major: this.gameVersion,
        game: 'live',
        backend: '6'
      },
      hwCode: this.hwid,
    });

    try {
      const result: ApiResponse = await this.api.prod.post('launcher/game/start', {
        searchParams: {
          launcherVersion: this.launcherVersion,
          branch: 'alive',
        },
        headers: {
          Host: 'prod.escapefromtarkov.com',
          'Authorization': access_token,
        },
        body,
        unityAgent: false,
        appVersion: false,
        requestId: false,
      } as any);

      if (result.body.err === 0) {
        this.session = result.body.data;
        console.log('New session started!', this.session);
        return true;
      }
      
      throw `Invalid status code ${result.body.err}`;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activates a new HWID with a 2fa code
   * @param {string} email Account Email
   * @param {string} twoFactor 2FA Code from email
   */
  private async activateHardware(email: string, twoFactor: string) {
    const body = JSON.stringify({
      email,
      hwCode: this.hwid,
      activateCode: twoFactor,
    });

    try {
      await this.api.launcher.post('launcher/hardwareCode/activate', {
        searchParams: {
          launcherVersion: this.launcherVersion,
        },
        body,
      });
    } catch (error) {
      console.log(`Activate Hardware Failed`);
      throw error;
    }
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
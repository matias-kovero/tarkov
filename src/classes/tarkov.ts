import { Api } from "./api";
import * as crypto from 'crypto';

import { Profile } from "../types/profile";
import { ApiResponse } from "../types/api";
import { Hwid, SelectedProfile, MarketFilter } from "../types/tarkov";
import { Localization } from "../types/i18n";
import { Trader } from "../types/traders";
import { ItemsList } from "../types/item";
import { Weather } from "../types/weather";
import { Messages } from "../types/messages";
import { MessageAttachements } from "../types/MessageAttachements";
import { MarketOffers } from "../types/market";

const fs = require('fs');

/** Tarkov API Wrapper */
export class Tarkov {
  private hwid: Hwid; // Users HWID
  private api: Api; // Our HTTP Client for making requests
  profiles: Profile[] = [];
  profile!: Profile;
  localization!: Localization;
  itemsList!: ItemsList;

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
    const result: ApiResponse<Profile[]> = await this.api.prod.post('client/game/profile/list');
    this.profiles = result.body.data;
    return this.profiles;
  }

  /**
   * Select a profile
   * @param {string} profileId
   */
  public async selectProfile(profileId: string): Promise<SelectedProfile> {
    const body = JSON.stringify({ uid: profileId });
    const result: ApiResponse<SelectedProfile> = await this.api.prod.post('client/game/profile/select', {
      body,
    });

    return result.body.data;
  }

  /**
   * Get all traders
   */
  public async getTraders(): Promise<Trader[]> {
    const result: ApiResponse<Trader[]> = await this.api.trading.post('client/trading/api/getTradersList');
    return result.body.data;
  }

  /**
   * Get a trader by id
   * @param {string} id The traders ID
   */
  public async getTrader(id: string): Promise<Trader> {
    const result: ApiResponse<Trader> = await this.api.trading.post(`client/trading/api/getTrader/${id}`);
    return result.body.data;
  }

  /**
   * Get all messages
   * @param {number} [type] The type of message to filter by - OPTIONAL
   */
  public async getMessages(type?: number): Promise<Messages[]> {
    const result: ApiResponse<Messages[]> = await this.api.prod.post('client/mail/dialog/list');

    // Optionally filter by type
    if (type) {
      return result.body.data.filter((dialog: Messages) => dialog.type === type);
    }

    return result.body.data;
  }

  /**
   * Get message attachements
   * @param {string} id Message ID to get attachements for
   */
  public async getMessageAttachements(id?: string): Promise<MessageAttachements> {
    const body = JSON.stringify({ dialogId: id });
    const result: ApiResponse<MessageAttachements> = await this.api.prod.post('client/mail/dialog/getAllAttachments', { body });
    return result.body.data;
  }

  /**
   * Get all items
   */
  public async getItems(): Promise<ItemsList> {
    const body = JSON.stringify({crc : 0});
    const result: ApiResponse<ItemsList> = await this.api.prod.post('client/items', { body });
    this.itemsList = result.body.data;
    return result.body.data;
  }

  /**
   * Search offers from Flea Market.
   * @async
   * @param {Number} page - starting page, example: start searching from page 0.
   * @param {Number} limit - limit how many results to show. Example: 15.
   * @param {MarketFilter} filter - Market Filter
   * @param {Number} [filter.sortType=5] - ID = 0, Barter = 2, Mechant Rating = 3, Price = 5, Expiry = 6
   * @param {Number} [filter.sortDirection=0] - Ascending = 0, Descending = 1
   * @param {Number} [filter.currency=0] - All = 0, RUB = 1, USD = 2, EUR = 3
   * @param {Number} [filter.priceFrom=0] - Won't show offers below this number
   * @param {Number} [filter.priceTo=0] - Won't show offers higher than this number
   * @param {Number} [filter.quantityFrom=0] - Minimum items in the stack
   * @param {Number} [filter.quantityTo=0] - Max number of items in the stack
   * @param {Number} [filter.conditionFrom=0] - Won't show offers where item won't match minium condition
   * @param {Number} [filter.conditionTo=100] - Won't show offers where item won't match maxium condition
   * @param {Boolean} [filter.oneHourExpiration=false] - Show items that are expiring within hour
   * @param {Boolean} [filter.removeBartering=true] - Should we hide bartering offers
   * @param {Number} [filter.offerOwnerType=0] - Any owner = 0, Listed by traders = 1, Listed by players = 2
   * @param {Boolean} [filter.onlyFunctional=true] - Hide weapons that are inoperable
   * @param {String} [filter.handbookId=""] - item id you are searching
   * @param {String} [filter.linkedSearchId=""] - if you are performing linked item search, include item id
   * @param {String} [filter.neededSearchId=""] - if you are performing required item search, include item id
   */
  public async searchMarket(page: number, limit: number, filter: MarketFilter): Promise<MarketOffers> {
    const body = JSON.stringify({
      page: page,
      limit: limit,
      sortType: 5,
      sortDirection: 0,
      currency: 0,
      priceFrom: 0,
      priceTo: 0,
      quantityFrom: 0,
      quantityTo: 0,
      conditionFrom: 0,
      conditionTo: 100,
      oneHourExpiration: false,
      removeBartering: true,
      offerOwnerType: 0,
      onlyFunctional: true,
      updateOfferCount: true,
      handbookId: '',
      linkedSearchId: '',
      neededSearchId: '',
      tm: 1,
      ...filter,
    });
    
    const result: ApiResponse<MarketOffers> = await this.api.ragfair.post('client/ragfair/find', { body });
    return result.body.data;
  }

  /**
   * Get weather
   */
  public async getWeather(): Promise<Weather> {
    const result: ApiResponse<Weather> = await this.api.prod.post('client/weather');
    return result.body.data;
  }

  /**
   * get localization table
   * @param {string} language language code, example: English = en
   */
  public async getI18n(language: string): Promise<Localization> {
    const result: ApiResponse<Localization> = await this.api.prod.post(`client/locale/${language}`);
    this.localization = result.body.data;
    return result.body.data;
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
          branch: 'live',
        },
        headers: {
          Host: 'prod.escapefromtarkov.com',
          'Authorization': access_token,
        },
        body,
        unityAgent: false,
        appVersion: false,
        requestId: false,
        bsgSession: false,
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

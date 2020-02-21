import { Api } from "./api";
import * as crypto from 'crypto';

import { Profile } from "../types/profile";
import { ApiResponse } from "../types/api";
import { Hwid, SelectedProfile, MarketFilter, BarterItem, ItemForSale, ItemDestination } from "../types/tarkov";
import { Localization } from "../types/i18n";
import { Trader } from "../types/traders";
import { ItemsList } from "../types/item";
import { Weather } from "../types/weather";
import { Messages } from "../types/messages";
import { MessageAttachements } from "../types/MessageAttachements";
import { MarketOffers } from "../types/market";

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
   * @async
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
   * @async
   */
  public async getProfiles(): Promise<Profile[]> {
    const result: ApiResponse<Profile[]> = await this.api.prod.post('client/game/profile/list');
    this.profiles = result.body.data;
    return this.profiles;
  }

  /**
   * Select a profile
   * @async
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
   * @async
   */
  public async getTraders(): Promise<Trader[]> {
    const result: ApiResponse<Trader[]> = await this.api.trading.post('client/trading/api/getTradersList');
    return result.body.data;
  }

  /**
   * Get a trader by id
   * @async
   * @param {string} id The traders ID
   */
  public async getTrader(id: string): Promise<Trader> {
    const result: ApiResponse<Trader> = await this.api.trading.post(`client/trading/api/getTrader/${id}`);
    return result.body.data;
  }

  /**
   * Get all messages
   * @async
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
   * @async
   * @param {string} id Message ID to get attachements for
   */
  public async getMessageAttachments(id?: string): Promise<MessageAttachements> {
    const body = JSON.stringify({ dialogId: id });
    const result: ApiResponse<MessageAttachements> = await this.api.prod.post('client/mail/dialog/getAllAttachments', { body });
    return result.body.data;
  }

  /**
   * Get all items
   * @async
   */
  public async getItems(): Promise<ItemsList> {
    const body = JSON.stringify({ crc : 0 });
    const result: ApiResponse<ItemsList> = await this.api.prod.post('client/items', { body });
    this.itemsList = result.body.data;
    return result.body.data;
  }

  /**
   * Get weather
   * @async
   */
  public async getWeather(): Promise<Weather> {
    const result: ApiResponse<Weather> = await this.api.prod.post('client/weather');
    return result.body.data;
  }

  /**
   * Keep Alive
   * @async
   */
  public async keepAlive(): Promise<any> {
    const result: ApiResponse<any> = await this.api.prod.post('client/game/keepalive');
    return result.body.data;
  }

  /**
   * get localization table
   * @async
   * @param {string} language language code, example: English = en
   */
  public async getI18n(language: string): Promise<Localization> {
    const result: ApiResponse<Localization> = await this.api.prod.post(`client/locale/${language}`);
    this.localization = result.body.data;
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
   * Buy an item
   * UNTESTED
   * @async
   * @param {string} id - offer id
   * @param {number} count - amount of items to buy
   * @param {BarterItem[]} barterItems - array of items to fulfill the offer
   */
  public async buyItem(id: string, count: number, barterItems: BarterItem[]): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: 'RagFairBuyOffer',
        offers: [{
          id,
          count,
          items: barterItems,
        }],
      }],
      tm: 2,
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    return result.body.data;
  }

  /**
   * Sell an item
   * UNTESTED
   * @async
   * @param {string} traderId - trader id
   * @param {ItemForSale[]} items - Array of items to sell
   */
  public async sellItem(traderId: string, items: ItemForSale[]): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: "TradingConfirm",
        type: "sell_to_trader",
        tid: traderId,
        items: items.map((i: ItemForSale) => ({ ...i, scheme_id: 0 }))
      }],
      tm: 0,
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    return result.body.data;
  }

  /**
   * Offer an item
   * UNTESTED
   * @async
   * @param {array} items Array of item ids
   * @param {object} requirements id of item to move onto
   * @param {String} requirement._tpl - Items schema id. Also known _tpl. Ex. Rouble_id
   * @param {String} requirement.price - On what price you want to sell.
   * @param {boolean} sellAll - Sell all in one piece. Default false
   */
  public async offerItem(items: any[], requirements: any, sellAll = false): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: "RagFairAddOffer",
        sellInOnePiece: sellAll,
        items: items, // Array of item_ids
        requirements:[{
          _tpl: requirements._tpl,
          count: requirements.price,
          level: 0,
          side: 0,
          onlyFunctional: false,
        }],
      tm: 2,
      }],
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    return result.body.data;
  }

  /**
   * Stack an item
   * UNTESTED
   * @async
   * @param {string} fromId id of item to move
   * @param {string} toId id of item to move onto
   */
  public async stackItem(fromId: string, toId: string): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: 'Merge',
        item: fromId,
        with: toId,
      }],
      tm: 2,
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    return result.body.data;
  }

  /**
   * Move an item
   * UNTESTED
   * @async
   * @param {string} itemId collect item id
   * @param {ItemDestination} destination - info where to move. {id, container, location:{x,y,r} }
   * @param {String} destination.id - item id where we move
   * @param {String} [destination.container="hideout"] - 'main' = container, 'hideout' = stash
   * @param {Object} [destination.location={x:0,y:0,r:0}] - {x, y, r} x & y locations, topleft is 0,0. r = 0 or 1.
   */
  public async moveItem(itemId: string, destination: ItemDestination): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: 'Move',
        item: itemId,
        to: {
          container: 'hideout', // main = container, hideout = stash 
          location: { x: 0, y: 0, r: 0 }, // try to put to topleft if empty
          ...destination,
        },
      }],
      tm: 2,
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    return result.body.data;
  }

  /**
   * Collect an item
   * UNTESTED
   * @async
   * @param {string} itemId collect item id
   * @param {string} stashId players stashId. Get it from `profile.inventory.stash`
   * @param {string} attachmentId attachments id
   */
  public async collectItem(itemId: string, stashId: string, attachmentId: string): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: 'Move',
        item: itemId,
        to:{
          id: stashId,
          container: 'hideout',
        },
        fromOwner: {
          id: attachmentId,
          type: 'Mail'
        }
      }]
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
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

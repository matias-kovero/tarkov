import { TraderData, Repair, Insurance, Loyalty } from "../types/traders";
import { ApiResponse } from "../types/api";
import { Api } from "./api";
import { ItemForSale } from "../types/tarkov";
import { container } from "tsyringe";
import { Profile } from "./profile";

export class Trader {
  _id!: string;
  working!: boolean;
  customization_seller!: boolean;
  name!: string;
  surname!: string;
  nickname!: string;
  location!: string;
  avatar!: string;
  balance_rub!: number;
  balance_dol!: number;
  balance_eur!: number;
  display!: boolean;
  discount!: number;
  discount_end!: number;
  buyer_up!: boolean;
  currency!: string;
  supply_next_time!: number;
  repair!: Repair;
  insurance!: Insurance;
  gridHeight!: number;
  loyalty!: Loyalty;
  sell_category!: any[];

  private api: Api;
  private profile: Profile;

  constructor(trader: TraderData) {
    Object.assign(this, trader);

    this.api = container.resolve(Api);
    this.profile = container.resolve(Profile);
  }


  /**
   * Get items for sale by the trader
   * @async
   */
  public async getItems(): Promise<any> {
    const result: ApiResponse<any> = await this.api.trading.post(`client/trading/api/getTraderAssort/${this._id}`);
    return result.body.data;
  }

  /**
   * Get trader prices for your items
   * @async
   */
  public async getSellPrices(): Promise<any> {
    const result: ApiResponse<any> = await this.api.trading.post(`client/trading/api/getUserAssortPrice/trader/${this._id}`);
    return result.body.data;
  }

  /**
   * Sell an item
   * @async
   * @param {ItemForSale[]} items - Array of items to sell
   */
  public async sell(items: ItemForSale[]): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: "TradingConfirm",
        type: "sell_to_trader",
        tid: this._id,
        items: items.map((i: ItemForSale) => ({ ...i, scheme_id: 0 })),
      }],
      tm: 0,
    });
    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });

    // Update our local inventory state
    this.profile.handleChanges(result.body.data.items);

    return result.body.data;
  }

}
import { User, Item, Requirement, OfferData } from "../types/market";
import { BarterItem } from "../types/tarkov";
import { ApiResponse } from "../types/api";
import { container } from "tsyringe";
import { Api } from "./api";
import { Profile } from "./profile";

export class MarketOffer {
  _id!: string;
  intId!: string;
  user!: User;
  root!: string;
  items!: Item[];
  itemsCost!: number;
  requirements!: Requirement[];
  requirementsCost!: number;
  summaryCost!: number;
  sellInOnePiece!: boolean;
  startTime!: number;
  endTime!: number;
  loyaltyLevel!: number;
  buyRestrictionMax?: number;
  api: Api;
  profile: Profile;

  constructor(offer: OfferData) {
    Object.assign(this, offer);

    this.api = container.resolve(Api);
    this.profile = container.resolve(Profile);
  }

  /**
   * Buy this item from the market
   * @async
   * @param {number} count - amount of items to buy
   * @param {BarterItem[]} barterItems - array of items to fulfill the offer
   */
  async buy(count: number, barterItems: BarterItem[]): Promise<any> {
    const body = JSON.stringify({
      data: [{
        Action: 'RagFairBuyOffer',
        offers: [{
          id: this._id,
          count,
          items: barterItems,
        }],
      }],
      tm: 2,
    });

    const result: ApiResponse<any> = await this.api.prod.post('client/game/profile/items/moving', { body });
    
    // Update our local inventory state
    this.profile.handleChanges(result.body.data.items);

    return result.body.data;
  }

  /**
   * Buy this item from the market with roubles
   * @async
   * @param {number} count - amount of items to buy
   */
  async buyWithRoubles(count: number): Promise<any> {
    const roubles = this.profile.getRoubles();
    const stack = roubles.stacks.find(m => m.upd.StackObjectsCount >= this.summaryCost);

    if (stack === undefined) {
      throw new Error('Not enough money');
    }

    const barterItems: BarterItem[] = [{ id: stack._id, count: this.summaryCost }];
    return this.buy(count, barterItems);
  }

}
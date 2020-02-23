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

    const barterItems: BarterItem[] = [];
    let stacksTotal = 0;
    
    // Loop through our stacks of money
    roubles.stacks.forEach(stack => {
      // If our current total of roubles is less than the item cost
      if (stacksTotal < (this.summaryCost * count)) {
        let stackCount = stack.upd.StackObjectsCount;

        // If this entire stack pushes us over the cost, only take what we need
        if (stacksTotal + stackCount > (this.summaryCost * count)) {
          stackCount = (this.summaryCost * count) - stacksTotal;
        }

        // Add this stack to our barterItems array
        barterItems.push({
          id: stack._id,
          count: stackCount,
        });
  
        // Update our current stacksTotal
        stacksTotal += stackCount;
      }
    });

    // If our total is less than the cost, we don't have enough!
    if (stacksTotal < (this.summaryCost * count)) {
      throw new Error('Not enough money');
    }

    return this.buy(count, barterItems);
  }

}
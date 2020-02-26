/**
 * @packageDocumentation
 * @module Tarkov
 */

import {
  Info,
  Customization,
  Health,
  Inventory,
  Skills,
  Stats,
  ConditionCounters,
  Hideout,
  Bonus,
  Notes,
  Quest,
  TraderStandings,
  RagfairInfo,
  ProfileData,
  Item,
  ItemSearch,
} from '../types/profile';
import { singleton, container } from 'tsyringe';
import { ApiResponse } from '../types/api';
import { SelectedProfile } from '../types/tarkov';
import { Api } from './api';

@singleton()
export class Profile {
  _id!: string;
  aid!: number;
  savage!: string;
  Info!: Info;
  Customization!: Customization;
  Health!: Health;
  Inventory!: Inventory;
  Skills!: Skills;
  Stats!: Stats;
  Encyclopedia!: {
    [key: string]: boolean;
  };
  ConditionCounters!: ConditionCounters;
  BackendCounters: any;
  InsuredItems!: any[];
  Hideout!: Hideout;
  Bonuses!: Bonus[];
  Notes!: Notes;
  Quests!: Quest[];
  TraderStandings!: TraderStandings;
  RagfairInfo!: RagfairInfo;
  WishList!: any[];

  roubleId = '5449016a4bdc2d6f028b456f';
  dollarId = '5696686a4bdc2da3298b456a';
  euroId = '569668774bdc2da2298b4568';
  api: Api;

  constructor() {
    this.api = container.resolve(Api);
  }

  async selectProfile(profile: ProfileData) {
    const body = JSON.stringify({ uid: profile._id });
    const result: ApiResponse<SelectedProfile> = await this.api.prod.post('client/game/profile/select', {
      body,
    });

    Object.assign(this, profile);
  }

  get items() {
    return this.Inventory.items;
  }

  get inventory() {
    return this.Inventory;
  }

  get skills() {
    return this.Skills;
  }

  getItem(itemId: string): ItemSearch {
    let amount = 0;
    const stacks = this.Inventory.items.filter(i => i._tpl === itemId);
    stacks.forEach(stack => amount += stack.upd.StackObjectsCount || 0);

    return {
      itemId,
      amount,
      stacks,
    };
  }

  getStack(stackId: string): Item | undefined {
    return this.Inventory.items.find(item => item._id === stackId);
  }

  getRoubles(): ItemSearch {
    return this.getItem(this.roubleId);
  }

  getDollars(): ItemSearch {
    return this.getItem(this.dollarId);
  }

  getEuros(): ItemSearch {
    return this.getItem(this.euroId);
  }

  updateItems(updatedItems: Item[] = []): void {
    this.Inventory.items = this.Inventory.items.map((item: Item) => {
      // Search if this inventory item has been updated
      const index = updatedItems.findIndex(i => i._id === item._id);
      if (index >= 0) {
        // Return the updated item instead of the old one
        return updatedItems[index];
      }

      // Not updated, return it's current value
      return item;
    });
  }

  addItems(items: Item[] = []): void {
    this.Inventory.items = [
      ...this.Inventory.items,
      ...items,
    ];
  }

  removeItems(removedItems: Item[] = []): void {
    this.Inventory.items = this.Inventory.items.filter((item: Item) => {
      // Search if this inventory item has been removed
      const index = removedItems.findIndex(i => i._id === item._id);

      // Return true if we should keep it, false if we should remove it.
      return index === -1;
    });
  }

  handleChanges(items: any = {}) {
    if (items.new) {
      this.addItems(items.new);
    }

    if (items.change) {
      this.updateItems(items.change);
    }

    if (items.del) {
      this.removeItems(items.del);
    }
  }

}
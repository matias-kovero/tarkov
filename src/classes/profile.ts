import { Info, Customization, Health, Inventory, Skills, Stats, ConditionCounters, Hideout, Bonus, Notes, Quest, TraderStandings, RagfairInfo, ProfileData } from '../types/profile';

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

  constructor(profile: ProfileData) {
    Object.assign(this, profile);
  }

  get items() {
    return this.Inventory.items;
  }

}
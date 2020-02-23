/**
 * @packageDocumentation
 * @module Types
 */

export interface Prefab {
  path: string;
  rcid: string;
}

export interface UsePrefab {
  path: string;
  rcid: string;
}

export interface Filter {
  Filter: string[];
  ExcludedFilter: string[];
}

export interface Props2 {
  filters: Filter[];
  cellsH: number;
  cellsV: number;
  minCount: number;
  maxCount: number;
  maxWeight: number;
}

export interface Grid {
  _name: string;
  _id: string;
  _parent: string;
  _props: Props2;
  _proto: string;
}

export interface Props {
  Name: string;
  ShortName: string;
  Description: string;
  Weight: number;
  BackgroundColor: string;
  Width: number;
  Height: number;
  StackMaxSize: number;
  Rarity: string;
  SpawnChance: number;
  CreditsPrice: number;
  ItemSound: string;
  Prefab: Prefab;
  UsePrefab: UsePrefab;
  StackObjectsCount: number;
  NotShownInSlot: boolean;
  ExaminedByDefault: boolean;
  ExamineTime: number;
  IsUndiscardable: boolean;
  IsUnsaleable: boolean;
  IsUnbuyable: boolean;
  IsUngivable: boolean;
  IsLockedafterEquip: boolean;
  QuestItem: boolean;
  LootExperience: number;
  ExamineExperience: number;
  HideEntrails: boolean;
  RepairCost: number;
  RepairSpeed: number;
  ExtraSizeLeft: number;
  ExtraSizeRight: number;
  ExtraSizeUp: number;
  ExtraSizeDown: number;
  ExtraSizeForceAdd: boolean;
  MergesWithChildren: boolean;
  CanSellOnRagfair: boolean;
  CanRequireOnRagfair: boolean;
  BannedFromRagfair: boolean;
  ConflictingItems: any[];
  FixedPrice: boolean;
  Unlootable: boolean;
  UnlootableFromSlot: string;
  UnlootableFromSide: any[];
  ChangePriceCoef: number;
  AllowSpawnOnLocations: any[];
  SendToClient: boolean;
  AnimationVariantsNumber: number;
  DiscardingBlock: boolean;
  Grids: Grid[];
  Slots: any[];
  CanPutIntoDuringTheRaid: boolean;
  CantRemoveFromSlotsDuringRaid: any[];
  SearchSound: string;
  BlocksArmorVest: boolean;
  RigLayoutName: string;
  Durability: number;
  MaxDurability: number;
  armorZone: any[];
  armorClass: number;
  speedPenaltyPercent: number;
  mousePenalty: number;
  weaponErgonomicPenalty: number;
  BluntThroughput: number;
  ArmorMaterial: string;
}

export interface Item {
  _id: string;
  _name: string;
  _parent: string;
  _type: string;
  _props: Props;
  _proto: string;
}

export interface ItemsList {
  [key: string]: Item;
}
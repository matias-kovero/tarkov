export interface Settings {
  Role?: string;
  BotDifficulty?: string;
  Experience?: number;
}

export interface Info {
  Nickname: string;
  LowerNickname: string;
  Side: string;
  Voice: string;
  Level: number;
  Experience: number;
  RegistrationDate: number;
  GameVersion: string;
  AccountType: number;
  MemberCategory: string;
  lockedMoveCommands: boolean;
  SavageLockTime: number;
  LastTimePlayedAsSavage: number;
  Settings: Settings;
  NeedWipe: boolean;
  GlobalWipe: boolean;
  NicknameChangeDate: number;
  Bans: any[];
}

export interface Customization {
  Head: string;
  Body: string;
  Feet: string;
  Hands: string;
}

export interface Hydration {
  Current: number;
  Maximum: number;
}

export interface Energy {
  Current: number;
  Maximum: number;
}

export interface Health2 {
  Current: number;
  Maximum: number;
}

export interface Head {
  Health: Health2;
}

export interface Health3 {
  Current: number;
  Maximum: number;
}

export interface Chest {
  Health: Health3;
}

export interface Health4 {
  Current: number;
  Maximum: number;
}

export interface Stomach {
  Health: Health4;
}

export interface Health5 {
  Current: number;
  Maximum: number;
}

export interface LeftArm {
  Health: Health5;
}

export interface Health6 {
  Current: number;
  Maximum: number;
}

export interface RightArm {
  Health: Health6;
}

export interface Health7 {
  Current: number;
  Maximum: number;
}

export interface LeftLeg {
  Health: Health7;
}

export interface Health8 {
  Current: number;
  Maximum: number;
}

export interface RightLeg {
  Health: Health8;
}

export interface BodyParts {
  Head: Head;
  Chest: Chest;
  Stomach: Stomach;
  LeftArm: LeftArm;
  RightArm: RightArm;
  LeftLeg: LeftLeg;
  RightLeg: RightLeg;
}

export interface Health {
  Hydration: Hydration;
  Energy: Energy;
  BodyParts: BodyParts;
  UpdateTime: number;
}

export interface Location {
  x: number;
  y: number;
  r: number;
  isSearched: boolean;
}

export interface Upd {
  StackObjectsCount: number;
}

export interface Item {
  _id: string;
  _tpl: string;
  parentId: string;
  slotId: string;
  location: Location;
  upd: Upd;
}

export interface FastPanel {
}

export interface Inventory {
  items: Item[];
  equipment: string;
  stash: string;
  questRaidItems: string;
  questStashItems: string;
  fastPanel: FastPanel;
}

export interface Common {
  Id: string;
  Progress: number;
  PointsEarnedDuringSession: number;
  LastAccess: number;
}

export interface Mastering {
  Id: string;
  Progress: number;
}

export interface Skills {
  Common: Common[];
  Mastering: Mastering[];
  Points: number;
}

export interface Item2 {
  Key: string[];
  Value: number;
}

export interface SessionCounters {
  Items: Item2[];
}

export interface Item3 {
  Key: string[];
  Value: number;
}

export interface OverallCounters {
  Items: Item3[];
}

export interface Aggressor {
  Name: string;
  Side: string;
  BodyPart: string;
  HeadSegment: string;
  WeaponName: string;
  Category: string;
}

export interface Stats {
  SessionCounters: SessionCounters;
  OverallCounters: OverallCounters;
  SessionExperienceMult: number;
  ExperienceBonusMult: number;
  TotalSessionExperience: number;
  LastSessionDate: number;
  Aggressor: Aggressor;
  DroppedItems: any[];
  FoundInRaidItems: any[];
  Victims: any[];
  CarriedQuestItems: any[];
  TotalInGameTime: number;
  SurvivorClass: string;
}

export interface Counter {
  id: string;
  value: number;
}

export interface ConditionCounters {
  Counters: Counter[];
}

export interface Production {
}

export interface Area {
  type: number;
  level: number;
  active: boolean;
  passiveBonusesEnabled: boolean;
  completeTime: number;
  constructing: boolean;
  slots: any[];
}

export interface Hideout {
  Production: Production;
  Areas: Area[];
}

export interface Bonus {
  type: string;
  templateId: string;
}

export interface Notes {
  Notes: any[];
}

export interface StatusTimers {
  2: number;
}

export interface Quest {
  qid: string;
  startTime: number;
  status: number;
  statusTimers: StatusTimers;
}

export interface TraderStandings {
}

export interface RagfairInfo {
  rating: number;
  isRatingGrowing: boolean;
  offers: any[];
}

export interface Profile {
  _id: string;
  aid: number;
  savage: string;
  Info: Info;
  Customization: Customization;
  Health: Health;
  Inventory: Inventory;
  Skills: Skills;
  Stats: Stats;
  Encyclopedia: {
    [key: string]: boolean;
  };
  ConditionCounters: ConditionCounters;
  BackendCounters: any;
  InsuredItems: any[];
  Hideout: Hideout;
  Bonuses: Bonus[];
  Notes: Notes;
  Quests: Quest[];
  TraderStandings: TraderStandings;
  RagfairInfo: RagfairInfo;
  WishList: any[];
}
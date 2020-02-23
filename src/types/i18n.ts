/**
 * @packageDocumentation
 * @module Types
 */

export interface Interface {
  [key: string]: string;
}

export interface Error {
  [key: string]: string;
}

export interface Mail {
  [key: string]: string;
}

export interface Conditions {
  [key: string]: string;
}

export interface Condition {
  conditions: Conditions;
  name: string;
  description: string;
  note: string;
  failMessageText: string;
  startedMessageText: string;
  successMessageText: string;
  location: string;
}

export interface Quest {
  [key: string]: Condition;
}

export interface PresetItem {
  Name: string;
}

export interface Preset {
  [key: string]: PresetItem;
}

export interface Handbook {
  [key: string]: string;
}

export interface Season {
  [key: string]: string;
}

export interface Template {
  Name: string;
  ShortName: string;
  Description: string;
}

export interface Templates {
  [key: string]: Template;
}

export interface Location {
  Name: string;
  ShortName?: string;
  Description: string;
}

export interface Locations {
  [key: string]: Location;
}

export interface Banner {
  Name: string;
  ShortName?: string;
  Description: string;
}

export interface Banners {
  [key: string]: Banner;
}

export interface Trader {
  FullName: string;
  FirstName: string;
  Nickname: string;
  Location: string;
  Description: string;
}

export interface Trading {
  [key: string]: Trader;
}

export interface Localization {
  interface: Interface;
  enum: any[];
  error: Error;
  mail: Mail;
  quest: Quest;
  preset: Preset;
  handbook: Handbook;
  season: Season;
  templates: Templates;
  locations: Locations;
  banners: Banners;
  trading: Trading;
}

/**
 * @packageDocumentation
 * @module Types
 */

import { MarketOffer } from "../classes/marketOffer";

export interface User {
  id: string;
  memberType: number;
  nickname: string;
  rating: number;
  isRatingGrowing: boolean;
  avatar?: any;
}

export interface Key {
  NumberOfUsages: number;
}

export interface Upd {
  Key: Key;
  StackObjectsCount: number;
}

export interface Item {
  _id: string;
  _tpl: string;
  upd: Upd;
}

export interface Requirement {
  count: number;
  _tpl: string;
}

export interface OfferData {
  _id: string;
  intId: string;
  user: User;
  root: string;
  items: Item[];
  itemsCost: number;
  requirements: Requirement[];
  requirementsCost: number;
  summaryCost: number;
  sellInOnePiece: boolean;
  startTime: number;
  endTime: number;
  loyaltyLevel: number;
  buyRestrictionMax?: number;
}

export interface Categories {
  [key: string]: number;
}

export interface MarketOffers {
  offers: MarketOffer[];
  offersCount: number;
  selectedCategory: string;
  categories: Categories;
}
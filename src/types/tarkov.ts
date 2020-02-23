/**
 * @packageDocumentation
 * @module Types
 */

export type Hwid = string;

export interface Notifier {
  server: string;
  channel_id: string;
  url: string;
}

export interface SelectedProfile {
  status: string;
  notifier: Notifier;
  notifierServer: string;
}

export interface MarketFilter {
  sortType?: number;
  sortDirection?: number;
  currency?: number;
  priceFrom?: number;
  priceTo?: number;
  quantityFrom?: number;
  quantityTo?: number;
  conditionFrom?: number;
  conditionTo?: number;
  oneHourExpiration?: boolean;
  removeBartering?: boolean;
  offerOwnerType?: number;
  onlyFunctional?: boolean;
  handbookId: string; // Required item id
  linkedSearchId?: string;
  neededSearchId?: string;
}

export interface BarterItem {
  id: string;
  count: number;
}

export interface ItemForSale {
  id: string,
  count: number,
}

export interface ItemDestination {
  id: string;
  container: 'main' | 'hideout';
  location?: {
    x: number;
    y: number;
    r: 0 | 1;
  };
}
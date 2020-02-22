/**
 * @packageDocumentation
 * @module Types
 */

export interface Repair {
  availability: boolean;
  quality: string;
  excluded_id_list: any[];
  excluded_category: any[];
  currency: string;
  currency_coefficient: number;
  price_rate: number;
}

export interface Insurance {
  availability: boolean;
  min_payment: number;
  min_return_hour: number;
  max_return_hour: number;
  max_storage_time: number;
  excluded_category: any[];
}

export interface LoyaltyLevel {
  minLevel: number;
  minSalesSum: number;
  minStanding: number;
}

export interface LoyaltyLevels {
  [key: string]: LoyaltyLevel;
}

export interface Loyalty {
  currentLevel: number;
  currentStanding: number;
  currentSalesSum: number;
  loyaltyLevels: LoyaltyLevels;
}

export interface Trader {
  _id: string;
  working: boolean;
  customization_seller: boolean;
  name: string;
  surname: string;
  nickname: string;
  location: string;
  avatar: string;
  balance_rub: number;
  balance_dol: number;
  balance_eur: number;
  display: boolean;
  discount: number;
  discount_end: number;
  buyer_up: boolean;
  currency: string;
  supply_next_time: number;
  repair: Repair;
  insurance: Insurance;
  gridHeight: number;
  loyalty: Loyalty;
  sell_category: any[];
}

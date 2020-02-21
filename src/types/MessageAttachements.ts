export interface SystemData {
  buyerNickname: string;
  soldItem: string;
  itemCount: number;
}

export interface Upd {
  StackObjectsCount: number;
}

export interface Datum {
  _id: string;
  _tpl: string;
  upd: Upd;
  parentId: string;
  slotId: string;
}

export interface Items {
  stash: string;
  data: Datum[];
}

export interface Message {
  _id: string;
  uid: string;
  type: number;
  dt: number;
  templateId: string;
  systemData: SystemData;
  items: Items;
  maxStorageTime: number;
  hasRewards: boolean;
}

export interface MessageAttachements {
  messages: Message[];
  profiles: any[];
}

export interface SystemData {
  buyerNickname: string;
  soldItem: string;
  itemCount: number;
}

export interface Message {
  dt: number;
  type: number;
  text: string;
  uid: string;
  templateId: string;
  systemData: SystemData;
}

export interface Messages {
  type: number;
  message: Message;
  attachmentsNew: number;
  _id: string;
  pinned: boolean;
  new?: number;
}
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
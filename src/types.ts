export enum ProductId {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
}

interface InfoMessage {
  event: "info";
  version: number;
}

interface SubscribedMessage {
  event: "subscribed";
  feed: string;
  product_ids: string[];
}

export type PriceLevel = [number, number]; // price, size

export interface InitialSnapshotMessage {
  numLevels: number;
  product_id: string;
  feed: "book_ui_1_snapshot";
  bids: PriceLevel[];
  asks: PriceLevel[];
}

export interface DeltaMessage {
  product_id: ProductId;
  feed: "book_ui_1";
  bids?: PriceLevel[];
  asks?: PriceLevel[];
}

export type SocketMessage =
  | InfoMessage
  | SubscribedMessage
  | InitialSnapshotMessage
  | DeltaMessage;

export const isInitialSnaphotMessage = (
  message: SocketMessage
): message is InitialSnapshotMessage => {
  return (message as InitialSnapshotMessage).feed === "book_ui_1_snapshot";
};

export const isDeltaMessage = (
  message: SocketMessage
): message is DeltaMessage => {
  return !!(message as DeltaMessage).asks || !!(message as DeltaMessage).bids;
};

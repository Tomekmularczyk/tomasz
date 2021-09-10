import { useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  DeltaMessage,
  InitialSnapshotMessage,
  isDeltaMessage,
  isInitialSnaphotMessage,
  ProductId,
  SocketMessage,
} from "./types";
import { useInterval } from "react-use";

interface Props {
  productId: ProductId;
  setInitialSnapshot: (snapshot: InitialSnapshotMessage) => void;
  setDeltaMessages: (delta: DeltaMessage[]) => void;
}

export const DataSource = ({
  productId,
  setInitialSnapshot,
  setDeltaMessages,
}: Props) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    "wss://www.cryptofacilities.com/ws/v1"
  );
  const lastMessage: SocketMessage | undefined = lastJsonMessage;
  const deltasRef = useRef<DeltaMessage[]>([]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [productId],
      });
    }
  }, [readyState, sendJsonMessage, productId]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    if (isInitialSnaphotMessage(lastMessage)) {
      setInitialSnapshot(lastMessage);
    } else if (isDeltaMessage(lastMessage)) {
      deltasRef.current.push(lastMessage);
    }
  }, [lastMessage, setInitialSnapshot]);

  // batch updates to prevent too many re-renders
  useInterval(() => {
    setDeltaMessages(deltasRef.current);
    deltasRef.current = [];
  }, 3000);

  return null;
};

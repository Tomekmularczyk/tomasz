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
import { useInterval, usePrevious } from "react-use";

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
  const deltasRef = useRef<DeltaMessage[]>([]);
  const prevProductId = usePrevious(productId);
  const lastMessage: SocketMessage | undefined = lastJsonMessage;

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [prevProductId],
      });
      deltasRef.current = []; // cleanup old messages
      sendJsonMessage({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [productId],
      });
    }
  }, [readyState, sendJsonMessage, productId, prevProductId]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    if (isInitialSnaphotMessage(lastMessage)) {
      setInitialSnapshot(lastMessage);
    } else if (
      isDeltaMessage(lastMessage) &&
      lastMessage.product_id === productId // ignore messages from previous feed
    ) {
      deltasRef.current.push(lastMessage);
    }
  }, [lastMessage, setInitialSnapshot, productId]);

  // batch updates to prevent too many re-renders
  useInterval(() => {
    setDeltaMessages(deltasRef.current);
    deltasRef.current = [];
  }, 3000);

  return null;
};

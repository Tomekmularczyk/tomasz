import { useEffect, useRef } from "react";
import { useInterval, usePrevious } from "react-use";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  DeltaMessage,
  InitialSnapshotMessage,
  isDeltaMessage,
  isInitialSnaphotMessage,
  ProductId,
  SocketMessage,
} from "./types";
import { useDeviceSpeed } from "./useDeviceType";

interface Props {
  productId: ProductId;
  setInitialSnapshot: (snapshot: InitialSnapshotMessage) => void;
  setDeltaMessages: (delta: DeltaMessage[]) => void;
  onError: () => void;
}

/**
 * Component that handles data fetching.
 *
 * This could be a hook, however there is no way to stop websocket using react-use-websocket
 * other than unmount the hook.
 */
export const DataSource = ({
  productId,
  setInitialSnapshot,
  setDeltaMessages,
  onError,
}: Props) => {
  const deviceSpeed = useDeviceSpeed();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    "wss://www.cryptofacilities.com/ws/v1",
    {
      onError,
    }
  );
  const deltasRef = useRef<DeltaMessage[]>([]);
  const prevProductId = usePrevious(productId);
  const lastMessage: SocketMessage | undefined = lastJsonMessage;

  // subscribe/unsubscribe to data feed
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

  // handle streaming data
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

  // batch updates to prevent too frequent re-renders
  const interval = {
    slow: 3_000,
    medium: 1_500,
    fast: 750,
  }[deviceSpeed];
  useInterval(() => {
    setDeltaMessages(deltasRef.current);
    deltasRef.current = [];
  }, interval);

  return null;
};

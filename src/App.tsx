import React, { useCallback, useState } from "react";
import { useEvent, useNetworkState } from "react-use";
import styled from "styled-components/macro";
import { DataSource } from "./DataSource";
import { Orderbook } from "./Orderbook/Orderbook";
import {
  DeltaMessage,
  FeedStatus,
  InitialSnapshotMessage,
  ProductId,
} from "./types";

const MainContainer = styled.main`
  background-color: black;
  font-family: "Courier New", sans-serif;
`;

function App() {
  const networkState = useNetworkState();
  const [feedStatus, setFeedStatus] = useState<FeedStatus>("feeding");
  const [productId, setProductId] = useState(ProductId.PI_XBTUSD);
  const [initialSnapshot, setInitialSnapshot] =
    useState<InitialSnapshotMessage>();
  const [deltas, setDeltas] = useState<DeltaMessage[]>([]);

  useEvent("blur", () => {
    setFeedStatus("stopped");
  });

  const resetOrderbookData = useCallback(() => {
    setInitialSnapshot(undefined);
    setDeltas([]);
  }, []);

  const handleToggleFeed = useCallback(() => {
    if (productId === ProductId.PI_ETHUSD) {
      setProductId(ProductId.PI_XBTUSD);
    } else {
      setProductId(ProductId.PI_ETHUSD);
    }
    // reinitialize orderbook
    resetOrderbookData();
  }, [productId, resetOrderbookData]);

  const handleRestartFeed = useCallback(() => {
    setFeedStatus("feeding");
    resetOrderbookData();
  }, [resetOrderbookData]);

  const handleFeedError = useCallback(() => {
    setFeedStatus("error");
  }, [setFeedStatus]);

  if (networkState.online === false) {
    return <>you need to have internet connection to see the orderbook</>;
  }

  return (
    <MainContainer>
      {feedStatus === "feeding" ? (
        <DataSource
          productId={productId}
          setInitialSnapshot={setInitialSnapshot}
          setDeltaMessages={setDeltas}
          onError={handleFeedError}
        />
      ) : null}
      {feedStatus === "error" ? (
        <p>
          We experienced an error loading the orderbook data.
          <button onClick={handleRestartFeed}>click here to retry</button>
        </p>
      ) : null}
      {initialSnapshot ? (
        <Orderbook
          initialSnapshot={initialSnapshot}
          deltas={deltas}
          onToggleFeedClick={handleToggleFeed}
          feedStatus={feedStatus}
          onRestartFeedClick={handleRestartFeed}
        />
      ) : (
        <p>pretty placeholder</p>
      )}
    </MainContainer>
  );
}

export default App;

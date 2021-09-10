import React, { useCallback, useState } from "react";
import { DataSource } from "./DataSource";
import { Orderbook } from "./Orderbook/Orderbook";
import { DeltaMessage, InitialSnapshotMessage, ProductId } from "./types";

function App() {
  const [productId, setProductId] = useState(ProductId.PI_XBTUSD);
  const [initialSnapshot, setInitialSnapshot] =
    useState<InitialSnapshotMessage>();
  const [deltas, setDeltas] = useState<DeltaMessage[]>([]);

  const handleToggleFeed = useCallback(() => {
    if (productId === ProductId.PI_ETHUSD) {
      setProductId(ProductId.PI_XBTUSD);
    } else {
      setProductId(ProductId.PI_ETHUSD);
    }
    // reinitialize orderbook
    setInitialSnapshot(undefined);
    setDeltas([]);
  }, [productId]);

  return (
    <main>
      <DataSource
        productId={productId}
        setInitialSnapshot={setInitialSnapshot}
        setDeltaMessages={setDeltas}
      />
      {initialSnapshot ? (
        <Orderbook
          initialSnapshot={initialSnapshot}
          deltas={deltas}
          onToggleFeedClick={handleToggleFeed}
        />
      ) : (
        <p>pretty placeholder</p>
      )}
    </main>
  );
}

export default App;

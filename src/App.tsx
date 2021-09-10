import React, { useState } from "react";
import { DataSource } from "./DataSource";
import { Orderbook } from "./Orderbook/Orderbook";
import { DeltaMessage, InitialSnapshotMessage, ProductId } from "./types";

function App() {
  const [initialSnapshot, setInitialSnapshot] =
    useState<InitialSnapshotMessage>();
  const [deltas, setDeltas] = useState<DeltaMessage[]>([]);

  return (
    <main>
      <DataSource
        productId={ProductId.PI_XBTUSD}
        setInitialSnapshot={setInitialSnapshot}
        setDeltaMessages={setDeltas}
      />
      {initialSnapshot ? (
        <Orderbook initialSnapshot={initialSnapshot} deltas={deltas} />
      ) : null}
    </main>
  );
}

export default App;

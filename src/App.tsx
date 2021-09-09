import React, { useState } from "react";
import { DataSource } from "./DataSource";
import { Orderbook } from "./Orderbook";
import { DeltaMessage, InitialSnapshotMessage, ProductId } from "./types";

function App() {
  const [initialSnapshot, setInitialSnapshot] =
    useState<InitialSnapshotMessage>();

  const [delta, setDelta] = useState<DeltaMessage>();

  return (
    <div>
      <DataSource
        productId={ProductId.PI_XBTUSD}
        setInitialSnapshot={setInitialSnapshot}
        setDeltaMessage={setDelta}
      />
      {initialSnapshot ? (
        <Orderbook initialSnapshot={initialSnapshot} delta={delta} />
      ) : null}
    </div>
  );
}

export default App;

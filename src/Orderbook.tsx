import React from "react";
import { DeltaMessage, InitialSnapshotMessage } from "./types";

interface Props {
  initialSnapshot: InitialSnapshotMessage;
  delta?: DeltaMessage;
}

export const Orderbook = ({ initialSnapshot, delta }: Props) => {
  return (
    <>
      <p>SNAPSHOT:</p>
      {JSON.stringify(initialSnapshot)}
      <br />
      <p>DELTA:</p>
      {JSON.stringify(delta)}
    </>
  );
};

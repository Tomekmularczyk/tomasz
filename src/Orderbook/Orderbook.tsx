import React, { useMemo, useState } from "react";
import {
  DeltaMessage,
  InitialSnapshotMessage,
  PriceLevel,
  PriceLevelWithTotal,
} from "../types";
import styled from "styled-components/macro";
import { Header } from "./Header";
import { PriceLevelsList } from "./PriceLevelsList";

const MainContainer = styled.div`
  background-color: black;
  font-family: "Courier New", sans-serif;
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const OrdersListWrapper = styled.div`
  width: 50%;
`;

const calculateTotals = (priceLevels: PriceLevel[]): PriceLevelWithTotal[] => {
  let total = 0;
  return priceLevels.map(([price, size]) => {
    total += size;
    return [price, size, total];
  });
};

interface Props {
  initialSnapshot: InitialSnapshotMessage;
  delta?: DeltaMessage;
}

export const Orderbook = ({ initialSnapshot, delta }: Props) => {
  const [state] = useState(initialSnapshot);

  const bidsWithTotals = useMemo(() => calculateTotals(state.bids), [state]);
  const asksWithTotals = useMemo(() => calculateTotals(state.asks), [state]);

  const lastBidPriceLevel = bidsWithTotals[bidsWithTotals.length - 1];
  const lastAskPriceLevel = bidsWithTotals[bidsWithTotals.length - 1];
  const highestTotal =
    lastBidPriceLevel[2] > lastAskPriceLevel[2]
      ? lastBidPriceLevel[2]
      : lastAskPriceLevel[2];

  return (
    <MainContainer>
      <Header spreadPoints={17.0} spreadPercentage={0.05} />
      <OrdersContainer>
        <OrdersListWrapper>
          <PriceLevelsList
            variant="bids"
            priceLevels={bidsWithTotals}
            highestTotal={highestTotal}
          />
        </OrdersListWrapper>
        <OrdersListWrapper>
          <PriceLevelsList
            variant="asks"
            priceLevels={asksWithTotals}
            highestTotal={highestTotal}
          />
        </OrdersListWrapper>
      </OrdersContainer>
    </MainContainer>
  );
};

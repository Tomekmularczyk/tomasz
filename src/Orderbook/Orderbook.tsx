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

  const [topBid] = bidsWithTotals;
  const [topAsk] = asksWithTotals;
  const bottomBid = bidsWithTotals[bidsWithTotals.length - 1];
  const bottomAsk = bidsWithTotals[bidsWithTotals.length - 1];
  const highestTotal =
    bottomBid[2] > bottomAsk[2] ? bottomBid[2] : bottomAsk[2];

  const spreadPoints = topAsk[0] - topBid[0];
  const spreadPercentage = (spreadPoints / topAsk[0]) * 100;

  return (
    <MainContainer>
      <Header spreadPoints={spreadPoints} spreadPercentage={spreadPercentage} />
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

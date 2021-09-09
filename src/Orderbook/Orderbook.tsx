import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";
import { DeltaMessage, InitialSnapshotMessage, PriceLevel } from "../types";
import { Header } from "./Header";
import { PriceLevelsList, PriceObj } from "./PriceLevelsList";

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

const getPriceListWithTotals = (
  priceLevels: Record<number, PriceObj>,
  maxListSize = 25
): PriceObj[] => {
  const list = Object.entries(priceLevels)
    .sort((a, b) => +b[0] - +a[0])
    .map((entry) => entry[1])
    .slice(0, maxListSize);

  let total = 0;
  return list.map(({ price, size }) => {
    total += size;
    return { price, size, total };
  });
};

const mapPrices = (priceLevels: [number, number][]) =>
  priceLevels.reduce<Record<number, PriceObj>>(
    (acc, next) => ({
      ...acc,
      [next[0]]: { price: next[0], size: next[1], total: 0 },
    }),
    {}
  );

const updateLevel = (
  currentState: Record<number, PriceObj>,
  priceLevels: PriceLevel[]
) => {
  const stateCopy = { ...currentState };
  priceLevels.forEach(([price, size]) => {
    if (size === 0) {
      delete stateCopy[price];
    } else {
      stateCopy[price] = {
        price,
        size,
        total: 0,
      };
    }
  });
  return stateCopy;
};

interface Props {
  initialSnapshot: InitialSnapshotMessage;
  delta?: DeltaMessage;
}

export const Orderbook = ({ initialSnapshot, delta }: Props) => {
  const [asks, setAsks] = useState(() => mapPrices(initialSnapshot.asks));
  const [bids, setBids] = useState(() => mapPrices(initialSnapshot.bids));

  useEffect(() => {
    if (delta) {
      setAsks((state) => updateLevel(state, delta.asks || []));
      setBids((state) => updateLevel(state, delta.bids || []));
    }
  }, [delta]);

  const bidsWithTotals = useMemo(() => getPriceListWithTotals(bids), [bids]);
  const asksWithTotals = useMemo(() => getPriceListWithTotals(asks), [asks]);

  const [topBid] = bidsWithTotals;
  const [topAsk] = asksWithTotals;
  const bottomBid = bidsWithTotals[bidsWithTotals.length - 1];
  const bottomAsk = bidsWithTotals[bidsWithTotals.length - 1];
  const highestTotal =
    bottomBid.total > bottomAsk.total ? bottomBid.total : bottomAsk.total;
  const spreadPoints = topAsk.price - topBid.price;
  const spreadPercentage = (spreadPoints / topAsk.price) * 100;

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

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";
import { Breakpoints } from "../theme";
import {
  DeltaMessage,
  FeedStatus,
  InitialSnapshotMessage,
  PriceLevel,
} from "../types";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PriceLevelData, PriceLevelsList } from "./PriceLevelsList";
import { Spread } from "./Spread";
import { useIsTabletAndAbove } from "./useIsTabletAndAbove";

const MainContainer = styled.div`
  background-color: black;
  font-family: "Courier New", sans-serif;
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-flow: row wrap;

  @media (min-width: ${Breakpoints.Tablet}px) {
    flex-wrap: nowrap;
    flex-direction: row-reverse;
  }
`;

const OrdersListWrapper = styled.div`
  width: 100%;

  @media (min-width: ${Breakpoints.Tablet}px) {
    width: 50%;
  }
`;

const getPriceListWithTotals = (
  priceLevels: Record<number, PriceLevelData>,
  direction: "asc" | "desc",
  listSize: number
): PriceLevelData[] => {
  const list = Object.entries(priceLevels)
    .sort((a, b) => {
      const valueOfA = Number(a[0]);
      const valueOfB = Number(b[0]);
      return direction === "asc" ? valueOfA - valueOfB : valueOfB - valueOfA;
    })
    .slice(0, listSize)
    .map(([, value]) => value);

  let total = 0;
  return list.map(({ price, size }) => {
    total += size;
    return { price, size, total };
  });
};

const mapPrices = (priceLevels: [number, number][]) =>
  priceLevels.reduce<Record<number, PriceLevelData>>(
    (acc, next) => ({
      ...acc,
      [next[0]]: {
        price: next[0],
        size: next[1],
        total: 0, // total will be calucalated separately later
      },
    }),
    {}
  );

const updateLevel = (
  currentState: Record<number, PriceLevelData>,
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
  deltas: DeltaMessage[];
  onToggleFeedClick: () => void;
  feedStatus: FeedStatus;
  onRestartFeedClick: () => void;
}

export const Orderbook = ({
  initialSnapshot,
  deltas,
  onToggleFeedClick,
  feedStatus,
  onRestartFeedClick,
}: Props) => {
  const isTabletAndAbove = useIsTabletAndAbove();
  const [asks, setAsks] = useState(() => mapPrices(initialSnapshot.asks));
  const [bids, setBids] = useState(() => mapPrices(initialSnapshot.bids));
  const numberOfPriceLevels = isTabletAndAbove ? 25 : 10;

  useEffect(() => {
    deltas.forEach((delta) => {
      setAsks((state) => updateLevel(state, delta.asks || []));
      setBids((state) => updateLevel(state, delta.bids || []));
    });
  }, [deltas]);

  const bidsWithTotals = useMemo(
    () => getPriceListWithTotals(bids, "desc", numberOfPriceLevels),
    [bids, numberOfPriceLevels]
  );
  const asksWithTotals = useMemo(
    () => getPriceListWithTotals(asks, "asc", numberOfPriceLevels),
    [asks, numberOfPriceLevels]
  );

  const [topBid] = bidsWithTotals;
  const [topAsk] = asksWithTotals;
  const bottomBid = bidsWithTotals[bidsWithTotals.length - 1];
  const bottomAsk = asksWithTotals[asksWithTotals.length - 1];
  const highestTotal =
    bottomBid.total > bottomAsk.total ? bottomBid.total : bottomAsk.total;
  const spreadPoints = topAsk.price - topBid.price;
  const spreadPercentage = (spreadPoints / topBid.price) * 100;

  return (
    <MainContainer>
      <Header
        spreadPoints={spreadPoints}
        spreadPercentage={spreadPercentage}
        feedStatus={feedStatus}
        onRestartFeedClick={onRestartFeedClick}
      />
      <OrdersContainer>
        <OrdersListWrapper>
          <PriceLevelsList
            colorVariant="red"
            depthGraphAlign="left"
            priceLevels={
              isTabletAndAbove ? asksWithTotals : asksWithTotals.reverse()
            }
            highestTotal={highestTotal}
            shouldDisplayColumnTitles
            shouldReverseColumns
          />
        </OrdersListWrapper>
        {!isTabletAndAbove ? (
          <Spread
            spreadPoints={spreadPoints}
            spreadPercentage={spreadPercentage}
          />
        ) : null}
        <OrdersListWrapper>
          <PriceLevelsList
            colorVariant="green"
            depthGraphAlign={isTabletAndAbove ? "right" : "left"}
            priceLevels={bidsWithTotals}
            highestTotal={highestTotal}
            shouldDisplayColumnTitles={isTabletAndAbove}
            shouldReverseColumns={!isTabletAndAbove}
          />
        </OrdersListWrapper>
      </OrdersContainer>
      <Footer onToggleFeedClick={onToggleFeedClick} />
    </MainContainer>
  );
};

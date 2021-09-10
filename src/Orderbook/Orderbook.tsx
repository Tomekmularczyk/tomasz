import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";
import { DeltaMessage, InitialSnapshotMessage, PriceLevel } from "../types";
import { PriceLevelsList, PriceLevelData } from "./PriceLevelsList";
import { useMedia } from "react-use";
import { Spread } from "./Spread";

const MainContainer = styled.div`
  background-color: black;
  font-family: "Courier New", sans-serif;
`;

const TopHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 2px solid white;
  color: white;
  padding: 6px 10px;
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-flow: row wrap;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    flex-direction: row-reverse;
  }
`;

const OrdersListWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ToggleFeedButton = styled.button`
  background-color: purple;
  cursor: pointer;
  border: none;
  margin: 8px auto;
  color: white;
  border-radius: 2px;
  padding: 4px 8px;
  letter-spacing: 2px;
  &:active {
    opacity: 0.9;
  }
`;

const Footer = styled.div`
  text-align: center;
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
}

export const Orderbook = ({
  initialSnapshot,
  deltas,
  onToggleFeedClick,
}: Props) => {
  const isTabletAndAbove = useMedia("(min-width: 768px)");
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
      <TopHeader>
        <p>Order Book</p>
        {isTabletAndAbove ? (
          <Spread
            spreadPoints={spreadPoints}
            spreadPercentage={spreadPercentage}
          />
        ) : null}
      </TopHeader>
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
      <Footer>
        <ToggleFeedButton type="button" onClick={onToggleFeedClick}>
          Toggle Feed
        </ToggleFeedButton>
      </Footer>
    </MainContainer>
  );
};

import React, { useEffect } from "react";
import styled from "styled-components/macro";
import { Breakpoints } from "../theme";
import { DeltaMessage, FeedStatus, InitialSnapshotMessage } from "../types";
import { useIsTabletAndAbove } from "../useIsTabletAndAbove";
import { Asks } from "./Asks";
import { Bids } from "./Bids";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Spread } from "./Spread";
import { usePriceLevelsList } from "./usePriceLevelsList";

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
  const { asks, bids, updatePriceLevels } = usePriceLevelsList(
    initialSnapshot,
    isTabletAndAbove ? 25 : 10
  );

  useEffect(() => {
    updatePriceLevels(deltas);
  }, [deltas, updatePriceLevels]);

  const [topBid] = bids;
  const [topAsk] = asks;
  const bottomBid = bids[bids.length - 1];
  const bottomAsk = asks[asks.length - 1];
  const highestTotal =
    bottomBid.total > bottomAsk.total ? bottomBid.total : bottomAsk.total;
  const spreadPoints = topAsk.price - topBid.price;
  const spreadPercentage = (spreadPoints / topBid.price) * 100;

  return (
    <>
      <Header
        spreadPoints={spreadPoints}
        spreadPercentage={spreadPercentage}
        feedStatus={feedStatus}
        onRestartFeedClick={onRestartFeedClick}
      />
      <OrdersContainer>
        <OrdersListWrapper>
          <Asks asks={asks} highestTotal={highestTotal} />
        </OrdersListWrapper>
        {!isTabletAndAbove ? (
          <Spread
            spreadPoints={spreadPoints}
            spreadPercentage={spreadPercentage}
          />
        ) : null}
        <OrdersListWrapper>
          <Bids bids={bids} highestTotal={highestTotal} />
        </OrdersListWrapper>
      </OrdersContainer>
      <Footer onToggleFeedClick={onToggleFeedClick} feedStatus={feedStatus} />
    </>
  );
};

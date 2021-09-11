import React from "react";
import styled from "styled-components/macro";
import { Breakpoints } from "../theme";
import { FeedStatus } from "../types";
import { useIsTabletAndAbove } from "../useIsTabletAndAbove";
import { Spread } from "./Spread";

const TopHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  border-bottom: 2px solid white;
  color: white;
  padding: 6px 10px;
  @media (min-width: ${Breakpoints.Tablet}px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const StatusText = styled.p`
  text-align: right;
`;

const RestartButton = styled.button`
  border: none;
  background-color: blue;
  text-transform: uppercase;
  color: white;
  margin-top: 2px;
  padding: 2px 4px;
  cursor: pointer;
  letter-spacing: 2px;
  font-size: 0.7rem;
`;

interface Props {
  spreadPoints: number;
  spreadPercentage: number;
  feedStatus: FeedStatus;
  onRestartFeedClick: () => void;
}

export const Header = ({
  spreadPoints,
  spreadPercentage,
  feedStatus,
  onRestartFeedClick,
}: Props) => {
  const isTabletAndAbove = useIsTabletAndAbove();

  return (
    <TopHeader>
      <p>Order Book</p>
      {isTabletAndAbove ? (
        <Spread
          spreadPoints={spreadPoints}
          spreadPercentage={spreadPercentage}
        />
      ) : null}
      <StatusText>
        Status: {feedStatus}
        <br />
        {feedStatus === "stopped" ? (
          <RestartButton onClick={onRestartFeedClick}>restart</RestartButton>
        ) : null}
      </StatusText>
    </TopHeader>
  );
};

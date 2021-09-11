import React from "react";
import styled from "styled-components/macro";
import { FeedStatus } from "../types";

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

const Container = styled.div`
  text-align: center;
`;

interface Props {
  onToggleFeedClick: () => void;
  feedStatus: FeedStatus;
}

export const Footer = ({ feedStatus, onToggleFeedClick }: Props) => {
  return (
    <Container>
      {feedStatus === "feeding" ? (
        <ToggleFeedButton type="button" onClick={onToggleFeedClick}>
          Toggle Feed
        </ToggleFeedButton>
      ) : null}
    </Container>
  );
};

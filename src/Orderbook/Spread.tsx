import React from "react";
import styled from "styled-components/macro";

const SpreadText = styled.p`
  color: gray;
  margin: 5px auto;
`;

const spreadFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const percentageFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface Props {
  spreadPoints: number;
  spreadPercentage: number;
}

export const Spread = ({ spreadPoints, spreadPercentage }: Props) => {
  return (
    <SpreadText>
      Spread: {spreadFormatter.format(spreadPoints)} (
      {percentageFormatter.format(spreadPercentage)}%)
    </SpreadText>
  );
};

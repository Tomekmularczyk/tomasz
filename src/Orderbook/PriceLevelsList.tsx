import React from "react";
import styled from "styled-components/macro";
import { PriceLevelWithTotal } from "../types";

type Variant = "bids" | "asks";

const Level = styled.div<{ depthPercentage: number; variant?: Variant }>`
  padding-left: 10%;
  padding-right: 5%;
  padding: 4px 5% 4px 10%;
  background: ${({ variant, depthPercentage }) => {
    const depth = 100 - depthPercentage;
    switch (variant) {
      case "bids":
        return `
          linear-gradient(
            90deg,
            transparent ${depth}%,
            #00ff0035 ${depth}%,
            #00FF0035 100%
          )
        `;
      case "asks":
        return `
          linear-gradient(
            270deg,
            transparent ${depth}%,
            #ff000035 ${depth}%,
            #ff000035 100%
          )
        `;
      default:
        return "tranparent";
    }
  }};
`;

const ColumnTitle = styled.p`
  text-transform: uppercase;
  color: gray;
`;

const DataRow = styled.div<{ variant?: Variant }>`
  display: flex;
  flex-flow: ${({ variant }) => (variant === "bids" ? "row" : "row-reverse")};
`;

const DataCell = styled.span`
  color: white;
  width: 33.33%;
  text-align: right;
`;

const List = styled.ol`
  border-top: 1px solid gray;
  list-style: none;
`;

const Price = styled.span<{ variant: Variant }>`
  color: ${({ variant }) => (variant === "bids" ? "green" : "red")};
`;

const numberFormatter = new Intl.NumberFormat("en-IN");
const priceFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
});

interface Props {
  priceLevels: PriceLevelWithTotal[];
  highestTotal: number;
  variant: Variant;
}

export const PriceLevelsList = ({
  priceLevels,
  highestTotal,
  variant,
}: Props) => {
  return (
    <>
      <Level depthPercentage={0}>
        <DataRow variant={variant}>
          <DataCell>
            <ColumnTitle>total</ColumnTitle>
          </DataCell>
          <DataCell>
            <ColumnTitle>size</ColumnTitle>
          </DataCell>
          <DataCell>
            <ColumnTitle>price</ColumnTitle>
          </DataCell>
        </DataRow>
      </Level>
      <List>
        {priceLevels.map(([price, size, total]) => {
          const depthPercentage = (total / highestTotal) * 100;
          return (
            <li>
              <Level
                key={price}
                depthPercentage={depthPercentage}
                variant={variant}
              >
                <DataRow variant={variant}>
                  <DataCell>{numberFormatter.format(total)}</DataCell>
                  <DataCell>{numberFormatter.format(size)}</DataCell>
                  <DataCell>
                    <Price variant={variant}>
                      {priceFormatter.format(price)}
                    </Price>
                  </DataCell>
                </DataRow>
              </Level>
            </li>
          );
        })}
      </List>
    </>
  );
};

import React from "react";
import styled from "styled-components/macro";
import { PriceLevelData } from "../types";

type ColorVariant = "green" | "red";
type DepthGraphAlign = "left" | "right";

const Level = styled.div`
  padding: 4px 5% 4px 10%;
`;

const ColumnTitlesWrapper = styled.div`
  border-bottom: 1px solid gray;
`;

const ColumnTitle = styled.p`
  text-transform: uppercase;
  color: gray;
`;

const DataRow = styled.div<{ shouldReverseColumns?: boolean }>`
  display: flex;
  flex-flow: ${({ shouldReverseColumns = false }) =>
    shouldReverseColumns ? "row-reverse" : "row"};
`;

const DataCell = styled.span`
  color: white;
  width: 33.33%;
  text-align: right;
`;

const List = styled.ol`
  list-style: none;
`;

const Price = styled.span<{ variant: ColorVariant }>`
  color: ${({ variant }) => (variant === "green" ? "green" : "red")};
`;

const numberFormatter = new Intl.NumberFormat("en-IN");

const priceFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
});

const getLevelDepthBackground = ({
  total,
  highestTotal,
  depthGraphAlign,
  colorVariant,
}: {
  total: number;
  highestTotal: number;
  depthGraphAlign: DepthGraphAlign;
  colorVariant: ColorVariant;
}): string | undefined => {
  const depthPercentage = (total / highestTotal) * 100;
  const depth = 100 - depthPercentage;
  const graphDirection = depthGraphAlign === "left" ? "270deg" : "90deg";
  switch (colorVariant) {
    case "green":
      return `
        linear-gradient(
          ${graphDirection},
          transparent ${depth}%,
          #00ff0035 ${depth}%,
          #00FF0035 100%
        )
      `;
    case "red":
      return `
        linear-gradient(
          ${graphDirection},
          transparent ${depth}%,
          #ff000035 ${depth}%,
          #ff000035 100%
        )
      `;
    default:
      return;
  }
};

interface Props {
  priceLevels: PriceLevelData[];
  highestTotal: number;
  colorVariant: ColorVariant;
  depthGraphAlign: DepthGraphAlign;
  shouldReverseColumns?: boolean;
  shouldDisplayColumnTitles?: boolean;
  shouldReversePriceLevels?: boolean;
}

export const OrdersList = ({
  priceLevels,
  highestTotal,
  colorVariant,
  depthGraphAlign,
  shouldDisplayColumnTitles = false,
  shouldReverseColumns = false,
}: Props) => {
  return (
    <>
      {shouldDisplayColumnTitles ? (
        <ColumnTitlesWrapper>
          <Level>
            <DataRow shouldReverseColumns={shouldReverseColumns}>
              <DataCell>
                <ColumnTitle>Total</ColumnTitle>
              </DataCell>
              <DataCell>
                <ColumnTitle>Size</ColumnTitle>
              </DataCell>
              <DataCell>
                <ColumnTitle>Price</ColumnTitle>
              </DataCell>
            </DataRow>
          </Level>
        </ColumnTitlesWrapper>
      ) : null}
      <List>
        {priceLevels.map(({ price, size, total }) => (
          <li key={price}>
            <Level
              style={{
                background: getLevelDepthBackground({
                  total,
                  highestTotal,
                  depthGraphAlign,
                  colorVariant,
                }),
              }}
            >
              <DataRow shouldReverseColumns={shouldReverseColumns}>
                <DataCell data-testid="total">
                  {numberFormatter.format(total)}
                </DataCell>
                <DataCell data-testid="size">
                  {numberFormatter.format(size)}
                </DataCell>
                <DataCell data-testid="price">
                  <Price variant={colorVariant}>
                    {priceFormatter.format(price)}
                  </Price>
                </DataCell>
              </DataRow>
            </Level>
          </li>
        ))}
      </List>
    </>
  );
};

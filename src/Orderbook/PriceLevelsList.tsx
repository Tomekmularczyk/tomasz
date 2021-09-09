import React from "react";
import styled from "styled-components/macro";

type Variant = "bids" | "asks";

const Level = styled.div`
  padding-left: 10%;
  padding-right: 5%;
  padding: 4px 5% 4px 10%;
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

export interface PriceObj {
  price: number;
  size: number;
  total: number;
}

interface Props {
  priceLevels: PriceObj[];
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
      <Level>
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
        {priceLevels.map(({ price, size, total }) => {
          const depthPercentage = (total / highestTotal) * 100;
          const depth = 100 - depthPercentage;
          let background;
          switch (variant) {
            case "bids":
              background = `
                linear-gradient(
                  90deg,
                  transparent ${depth}%,
                  #00ff0035 ${depth}%,
                  #00FF0035 100%
                )
              `;
              break;
            case "asks":
              background = `
                linear-gradient(
                  270deg,
                  transparent ${depth}%,
                  #ff000035 ${depth}%,
                  #ff000035 100%
                )
              `;
              break;
            default:
              break;
          }

          return (
            <li key={price}>
              <Level style={{ background }}>
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

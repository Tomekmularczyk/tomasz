import React, { memo } from "react";
import { PriceLevelData } from "../types";
import { useIsTabletAndAbove } from "../useIsTabletAndAbove";
import { OrdersList } from "./OrdersList";

interface Props {
  asks: PriceLevelData[];
  highestTotal: number;
}

export const Asks = memo(({ asks, highestTotal }: Props) => {
  const isTabletAndAbove = useIsTabletAndAbove();

  return (
    <OrdersList
      colorVariant="red"
      depthGraphAlign="left"
      priceLevels={isTabletAndAbove ? asks : [...asks].reverse()}
      highestTotal={highestTotal}
      shouldDisplayColumnTitles
      shouldReverseColumns
    />
  );
});

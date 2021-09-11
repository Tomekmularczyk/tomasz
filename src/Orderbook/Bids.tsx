import React, { memo } from "react";
import { PriceLevelData } from "../types";
import { useIsTabletAndAbove } from "../useIsTabletAndAbove";
import { OrdersList } from "./OrdersList";

interface Props {
  bids: PriceLevelData[];
  highestTotal: number;
}

export const Bids = memo(({ bids, highestTotal }: Props) => {
  const isTabletAndAbove = useIsTabletAndAbove();

  return (
    <OrdersList
      colorVariant="green"
      depthGraphAlign={isTabletAndAbove ? "right" : "left"}
      priceLevels={bids}
      highestTotal={highestTotal}
      shouldDisplayColumnTitles={isTabletAndAbove}
      shouldReverseColumns={!isTabletAndAbove}
    />
  );
});

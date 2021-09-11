import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DeltaMessage,
  InitialSnapshotMessage,
  PriceLevel,
  PriceLevelData,
} from "../types";

const getPriceLevelsList = (
  priceLevels: Record<number, PriceLevelData>,
  direction: "asc" | "desc",
  listLength: number
): PriceLevelData[] =>
  Object.entries(priceLevels)
    .sort((a, b) => {
      const valueOfA = Number(a[0]);
      const valueOfB = Number(b[0]);
      return direction === "asc" ? valueOfA - valueOfB : valueOfB - valueOfA;
    })
    .slice(0, listLength)
    .map(([, value]) => value);

const calculateTotals = (priceList: PriceLevelData[]): PriceLevelData[] => {
  let total = 0;
  return priceList.map(({ price, size }) => {
    total += size;
    return { price, size, total };
  });
};

const createPriceLevelsMap = (priceLevels: PriceLevel[]) =>
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

const updatePriceLevel = (
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

export const usePriceLevelsList = (
  initialSnapshot: InitialSnapshotMessage,
  listLength: number
) => {
  const [asks, setAsks] = useState(() =>
    createPriceLevelsMap(initialSnapshot.asks)
  );
  const [bids, setBids] = useState(() =>
    createPriceLevelsMap(initialSnapshot.bids)
  );

  const bidsWithTotals = useMemo(
    () => calculateTotals(getPriceLevelsList(bids, "desc", listLength)),
    [bids, listLength]
  );

  const asksWithTotals = useMemo(
    () => calculateTotals(getPriceLevelsList(asks, "asc", listLength)),
    [asks, listLength]
  );

  const updatePriceLevels = useCallback((deltas: DeltaMessage[]) => {
    deltas.forEach((delta) => {
      setAsks((state) => updatePriceLevel(state, delta.asks || []));
      setBids((state) => updatePriceLevel(state, delta.bids || []));
    });
  }, []);

  useEffect(() => {
    setAsks(createPriceLevelsMap(initialSnapshot.asks));
    setBids(createPriceLevelsMap(initialSnapshot.bids));
  }, [initialSnapshot]);

  return {
    asks: asksWithTotals,
    bids: bidsWithTotals,
    updatePriceLevels,
  };
};

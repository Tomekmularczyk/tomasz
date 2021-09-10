import { useMedia } from "react-use";
import { Breakpoints } from "../theme";

export const useIsTabletAndAbove = () =>
  useMedia(`(min-width: ${Breakpoints.Tablet}px)`);

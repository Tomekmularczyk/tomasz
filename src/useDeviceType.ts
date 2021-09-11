import { useHardwareConcurrency } from "react-adaptive-hooks/hardware-concurrency";
import { useMemoryStatus } from "react-adaptive-hooks/memory";

type DeviceType = "slow" | "medium" | "fast";

/**
 * Hook that determines user device perfomance possibility.
 * (Calculations are strictly opinionated, without any research)
 * @returns DeviceType
 */
export const useDeviceSpeed = (): DeviceType => {
  const { numberOfLogicalProcessors = 2 } = useHardwareConcurrency();
  const { deviceMemory = 4 } = useMemoryStatus();

  if (numberOfLogicalProcessors > 2 && deviceMemory > 4) {
    return "fast";
  }
  if (numberOfLogicalProcessors > 1 && deviceMemory <= 4 && deviceMemory >= 2) {
    return "medium";
  }
  return "slow";
};

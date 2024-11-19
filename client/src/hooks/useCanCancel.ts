import { addHours, isBefore } from "date-fns";

export function useCanCancel(startTime: Date) {
  const now = new Date();
  const twoHoursBeforeStart = addHours(startTime, -2);
  return isBefore(now, twoHoursBeforeStart);
}

import { addHours, isBefore } from "date-fns";

export function useCanCancel(start_time: Date) {
  const now = new Date();
  const twoHoursBeforeStart = addHours(start_time, -2);
  return isBefore(now, twoHoursBeforeStart);
}

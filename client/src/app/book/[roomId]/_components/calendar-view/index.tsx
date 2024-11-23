"use client";

import { useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { CalendarHeader } from "./Partials/calendar-header";
import { CalendarGrid } from "./Partials/calendar-grid";

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarView({
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthDays = (date: Date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) =>
      view === "month" ? add(prev, { months: -1 }) : add(prev, { weeks: -1 })
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "month" ? add(prev, { months: 1 }) : add(prev, { weeks: 1 })
    );
  };

  const handleToday = () => {
    const today = startOfToday();
    setCurrentDate(today);
    onDateSelect(today);
  };

  const days =
    view === "month" ? getMonthDays(currentDate) : getWeekDays(currentDate);

  return (
    <div className="space-y-4">
      <CalendarHeader
        date={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={setView}
        onToday={handleToday}
      />
      <CalendarGrid
        days={days}
        view={view}
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}

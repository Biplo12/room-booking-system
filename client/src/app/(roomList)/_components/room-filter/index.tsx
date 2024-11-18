"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar } from "./Partials/search-bar";
import { FilterSheet } from "./Partials/filter-sheet";
import { ActiveFilters } from "./Partials/active-filters";
import { FilterValues } from "./types";

export function RoomFilter() {
  const searchParams = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    capacity: searchParams.get("capacity") || "",
    equipment: searchParams.get("equipment") || "",
  });

  useEffect(() => {
    setSelectedFilters({
      capacity: searchParams.get("capacity") || "",
      equipment: searchParams.get("equipment") || "",
    });
  }, [searchParams]);

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
  };

  const handleFilterRemove = (filterKey: keyof FilterValues) => {
    setSelectedFilters({ ...selectedFilters, [filterKey]: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <SearchBar onSearch={handleSearch} />
        <FilterSheet
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
      </div>
      <ActiveFilters
        selectedFilters={selectedFilters}
        onFilterRemove={handleFilterRemove}
      />
    </div>
  );
}

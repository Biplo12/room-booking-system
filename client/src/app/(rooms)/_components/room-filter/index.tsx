"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar } from "./Partials/search-bar";
import { FilterSheet } from "./Partials/filter-sheet";
import { ActiveFilters } from "./Partials/active-filters";
import { FilterValues } from "./types";

export function RoomFilter() {
  const pathname = usePathname();
  const searchParams = pathname.split("?")[1];
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    capacity: searchParams?.split("capacity=")[1]?.split("&")[0] || "",
    equipment: searchParams?.split("equipment=")[1]?.split(",") || [],
  });

  useEffect(() => {
    setSelectedFilters({
      capacity: searchParams?.split("capacity=")[1]?.split("&")[0] || "",
      equipment:
        searchParams?.split("equipment=")[1]?.split(",").filter(Boolean) || [],
    });
  }, [searchParams]);

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
  };

  const handleFilterRemove = (
    filterKey: keyof FilterValues,
    value?: string
  ) => {
    if (filterKey === "equipment" && value) {
      setSelectedFilters({
        ...selectedFilters,
        equipment: selectedFilters.equipment.filter((item) => item !== value),
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterKey]: filterKey === "capacity" ? "" : [],
      });
    }
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

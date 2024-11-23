"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SearchBar } from "./Partials/search-bar";
import { FilterSheet } from "./Partials/filter-sheet";
import { ActiveFilters } from "./Partials/active-filters";
import { useFilterStore } from "@/store/filterStore";

export function RoomFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    search,
    capacity,
    equipment,
    setSearch,
    setPendingCapacity,
    setPendingEquipment,
  } = useFilterStore();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (capacity) params.set("capacity", capacity);
    if (equipment.length) params.set("equipment", equipment.join(","));

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }, [search, capacity, equipment, pathname, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || "";
    const capacityParam = params.get("capacity") || "";
    const equipmentParam =
      params.get("equipment")?.split(",").filter(Boolean) || [];

    setSearch(searchParam);
    setPendingCapacity(capacityParam);
    setPendingEquipment(equipmentParam);
  }, [setSearch, setPendingCapacity, setPendingEquipment]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <SearchBar />
        <FilterSheet />
      </div>
      <ActiveFilters />
    </div>
  );
}

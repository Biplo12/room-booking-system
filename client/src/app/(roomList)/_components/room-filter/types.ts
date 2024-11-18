export interface FilterValues {
  capacity: string;
  equipment: string;
}

export interface SearchBarProps {
  onSearch: (value: string) => void;
}

export interface FilterSheetProps {
  selectedFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

export interface ActiveFiltersProps {
  selectedFilters: FilterValues;
  onFilterRemove: (filterKey: keyof FilterValues) => void;
}

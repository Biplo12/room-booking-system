import { create } from "zustand";

interface FilterState {
  search: string;
  capacity: string;
  equipment: string[];
  pendingCapacity: string;
  pendingEquipment: string[];
  setSearch: (search: string) => void;
  setPendingCapacity: (capacity: string) => void;
  setPendingEquipment: (equipment: string[]) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  capacity: "",
  equipment: [],
  pendingCapacity: "",
  pendingEquipment: [],
  setSearch: (search) => set({ search }),
  setPendingCapacity: (capacity) => set({ pendingCapacity: capacity }),
  setPendingEquipment: (equipment) => set({ pendingEquipment: equipment }),
  applyFilters: () =>
    set((state) => ({
      capacity: state.pendingCapacity,
      equipment: state.pendingEquipment,
    })),
  clearFilters: () =>
    set({
      capacity: "",
      equipment: [],
      pendingCapacity: "",
      pendingEquipment: [],
    }),
}));

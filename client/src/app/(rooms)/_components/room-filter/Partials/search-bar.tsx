import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/store/filterStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export function SearchBar() {
  const { setSearch } = useFilterStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <Input
      placeholder="Search rooms..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full"
    />
  );
}

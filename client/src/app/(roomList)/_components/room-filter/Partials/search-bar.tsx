import { SearchBarProps } from "../types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export function SearchBar({ onSearch }: SearchBarProps) {
  const { searchTerm, setSearchTerm } = useSearch();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchTerm}
        placeholder="Search by room name or equipment..."
        className="pl-9"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

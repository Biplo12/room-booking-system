import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const handleSelect = (newValue: string) => {
    if (!value.includes(newValue)) {
      onChange([...value, newValue]);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const selectedItems = options.filter((option) =>
    value.includes(option.value)
  );
  const availableOptions = options.filter(
    (option) => !value.includes(option.value)
  );

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger>
          <div className="flex text-muted-foreground">{placeholder}</div>
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {availableOptions.length === 0 && (
            <SelectItem value="empty" disabled>
              No more options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <Badge
              key={item.value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item.label}
              <button
                type="button"
                onClick={() => handleRemove(item.value)}
                className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {item.label}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

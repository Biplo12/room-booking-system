import { Edit, Trash } from "lucide-react";
import { Room } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const HEADERS = ["Name", "Capacity", "Location", "Equipment", "Actions"];

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const getEquipmentArray = (equipment: string | string[]) => {
    return typeof equipment === "string"
      ? equipment
          .split(",")
          .filter(Boolean)
          .map((item) => item.trim())
      : Array.isArray(equipment)
      ? equipment
      : [];
  };

  const formatEquipmentName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {HEADERS.map((header) => (
              <th key={header} className="px-4 py-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b">
              <td className="px-4 py-3">{room.name}</td>
              <td className="px-4 py-3">{room.capacity}</td>
              <td className="px-4 py-3">{room.location}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getEquipmentArray(room.equipment).map((item) => (
                    <Badge key={item} variant="secondary">
                      {formatEquipmentName(item)}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(room)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onDelete(room)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

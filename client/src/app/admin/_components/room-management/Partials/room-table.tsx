import { Building2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room } from "@/interfaces";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const HEADERS = ["Name", "Capacity", "Location", "Equipment", "Actions"];

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
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
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {room.name}
                </div>
              </td>
              <td className="px-4 py-3">{room.capacity}</td>
              <td className="px-4 py-3">{room.location}</td>
              <td className="px-4 py-3">{room.equipment.join(", ")}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(room)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(room)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

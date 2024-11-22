import { Building2, Pencil, Trash2, Image, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room } from "@/interfaces";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const HEADERS = [
  "Name",
  "Capacity",
  "Location",
  "Equipment",
  "Image",
  "Actions",
];

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              <td className="px-4 py-3">{room.equipment}</td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedImage(room.image_url)}
                  disabled={!room.image_url}
                >
                  <Image className="h-4 w-4" />
                </Button>
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

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogTitle />
        <DialogContent className="max-w-3xl p-0">
          {selectedImage && (
            <img src={selectedImage} alt="Room" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

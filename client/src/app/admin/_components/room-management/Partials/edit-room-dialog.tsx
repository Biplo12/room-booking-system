import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomForm } from "./room-form";
import { Room } from "@/interfaces";

interface EditRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    capacity: string;
    location: string;
    equipment?: string[];
    image_url?: string;
  }) => void;
  room: Room | null;
}

export function EditRoomDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  room,
}: EditRoomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>Update the room details below.</DialogDescription>
        </DialogHeader>
        <RoomForm onSubmit={onSubmit} initialData={room} />
      </DialogContent>
    </Dialog>
  );
}

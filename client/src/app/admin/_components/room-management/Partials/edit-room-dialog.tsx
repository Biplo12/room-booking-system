import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomForm } from "./room-form";
import { FormSchema } from "../types";
import { Room } from "@/interfaces";

interface EditRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormSchema) => void;
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
        <RoomForm onSubmit={onSubmit} room={room} />
      </DialogContent>
    </Dialog>
  );
}

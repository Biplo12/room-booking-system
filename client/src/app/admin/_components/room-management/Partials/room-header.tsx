import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoomForm } from "./room-form";

interface RoomHeaderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => void;
}

export function RoomHeader({
  isOpen,
  onOpenChange,
  onSubmit,
}: RoomHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Rooms</h2>
      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new conference room.
              </DialogDescription>
            </DialogHeader>
            <RoomForm onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

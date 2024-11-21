"use client";

import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { RoomTable } from "./Partials/room-table";
import { RoomHeader } from "./Partials/room-header";
import { EditRoomDialog } from "./Partials/edit-room-dialog";
import { DeleteRoomDialog } from "./Partials/delete-room-dialog";
import { FormSchema } from "./types";
import { useBookingStore } from "@/store/bookingStore";
import { Room } from "@/interfaces";
import { toast } from "sonner";

export function RoomManagement() {
  const { rooms, setRooms } = useBookingStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const handleEdit = (room: Room) => {
    setRoomToEdit(room);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (room: Room) => {
    setRoomToDelete(room);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      toast.success("Room deleted successfully");
      setRoomToDelete(null);
    }
  };

  const onSubmit = (values: FormSchema) => {
    const roomData = {
      ...values,
      capacity: parseInt(values.capacity),
      equipment: values.equipment.split(",").map((item) => item.trim()),
    };

    if (roomToEdit) {
      setIsEditDialogOpen(false);
      toast.success("Room updated successfully");
    } else {
      setIsAddDialogOpen(false);
      toast.success("Room added successfully");
    }
    setRoomToEdit(null);
  };

  return (
    <div className="space-y-6">
      <RoomHeader
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onSubmit}
      />
      {rooms.length === 0 ? (
        <EmptyState
          title="No Rooms Available"
          description="Start by adding your first conference room"
          icon="Users"
        />
      ) : (
        <RoomTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <EditRoomDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={onSubmit}
        room={roomToEdit}
      />
      <DeleteRoomDialog
        room={roomToDelete}
        onOpenChange={() => setRoomToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { RoomTable } from "./Partials/room-table";
import { RoomHeader } from "./Partials/room-header";
import { EditRoomDialog } from "./Partials/edit-room-dialog";
import { DeleteRoomDialog } from "./Partials/delete-room-dialog";
import { FormSchema } from "./types";
import { Room } from "@/interfaces";
import { toast } from "sonner";
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "@/hooks/useRooms";
import Spinner from "@/components/spinner";
import { useBookingStore } from "@/store/bookingStore";

export function RoomManagement() {
  const { rooms } = useBookingStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const { isLoading, error } = useRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const handleEdit = (room: Room) => {
    setRoomToEdit(room);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (room: Room) => {
    setRoomToDelete(room);
  };

  const confirmDelete = async () => {
    if (roomToDelete) {
      try {
        await deleteRoom.mutateAsync(roomToDelete.id);
        toast.success("Room deleted successfully");
        setRoomToDelete(null);
      } catch (error) {
        toast.error("Failed to delete room");
      }
    }
  };

  const onSubmit = async (values: FormSchema) => {
    const roomData = {
      name: values.name,
      capacity: Number(values.capacity),
      location: values.location,
      equipment: values.equipment || "",
      image_url: values.image_url || "",
    };

    try {
      if (roomToEdit) {
        await updateRoom.mutateAsync({ ...roomData, id: roomToEdit.id });
        setIsEditDialogOpen(false);
        toast.success("Room updated successfully");
      } else {
        await createRoom.mutateAsync(roomData);
        setIsAddDialogOpen(false);
        toast.success("Room added successfully");
      }
      setRoomToEdit(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (roomToEdit ? "Failed to update room" : "Failed to add room");
      toast.error(errorMessage);
      console.error("Room operation failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Rooms"
        description="There was a problem loading the rooms. Please try again."
        icon="AlertTriangle"
      />
    );
  }

  return (
    <div className="space-y-6">
      <RoomHeader
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onSubmit}
      />
      {!rooms?.length ? (
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

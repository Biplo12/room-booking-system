import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Room } from "@/interfaces";
import { useBookingStore } from "@/store/bookingStore";
import { useEffect } from "react";

export function useRooms() {
  const { setRooms } = useBookingStore();

  const query = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data } = await api.get("/rooms");

      return data;
    },
  });

  useEffect(() => {
    if (query.data) {
      const rooms = query.data.data.items;
      setRooms(rooms);
    }
  }, [query.data, setRooms]);

  return query;
}

export function useRoom(roomId: number) {
  const { updateRoom } = useBookingStore();

  const query = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: async () => {
      const { data } = await api.get<Room>(`/rooms/${roomId}`);

      return data;
    },
    enabled: !!roomId,
  });

  useEffect(() => {
    if (query.data) {
      updateRoom(query.data);
    }
  }, [query.data, updateRoom]);

  return query;
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const { setRooms } = useBookingStore();

  return useMutation({
    mutationFn: async (roomData: Omit<Room, "id">) => {
      const { data } = await api.post<{ success: boolean; data: Room }>(
        "/rooms",
        roomData
      );
      return data.data;
    },
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      const { rooms } = useBookingStore.getState();
      setRooms([...rooms, newRoom]);
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  const { updateRoom } = useBookingStore();

  return useMutation({
    mutationFn: async ({ id, ...roomData }: Room) => {
      const { data } = await api.put<Room>(`/rooms/${id}`, roomData);
      return data;
    },
    onSuccess: (updatedRoom) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      updateRoom(updatedRoom);
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  const { deleteRoom } = useBookingStore();

  return useMutation({
    mutationFn: async (roomId: number) => {
      await api.delete(`/rooms/${roomId}`);
      return roomId;
    },
    onSuccess: (roomId) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      deleteRoom(roomId);
    },
  });
}

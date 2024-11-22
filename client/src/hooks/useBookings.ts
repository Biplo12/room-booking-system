import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Reservation } from "@/interfaces";
import { useBookingStore } from "@/store/bookingStore";
import { useEffect } from "react";

export function useBookings() {
  const { setReservations } = useBookingStore();

  const query = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await api.get<Reservation[]>("/bookings");
      return data;
    },
  });

  // Sync with store when data changes
  useEffect(() => {
    if (query.data) {
      setReservations(query.data);
    }
  }, [query.data, setReservations]);

  return query;
}

export function useRoomBookings(roomId: number) {
  const { setReservations } = useBookingStore();

  const query = useQuery({
    queryKey: ["bookings", "room", roomId],
    queryFn: async () => {
      const { data } = await api.get<Reservation[]>(
        `/rooms/${roomId}/bookings`
      );
      return data;
    },
    enabled: !!roomId,
  });

  // Sync room-specific bookings with store
  useEffect(() => {
    if (query.data) {
      setReservations(query.data);
    }
  }, [query.data, setReservations]);

  return query;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { addReservation } = useBookingStore();

  return useMutation({
    mutationFn: async (bookingData: Omit<Reservation, "id">) => {
      const { data } = await api.post<Reservation>("/bookings", bookingData);
      return data;
    },
    onSuccess: (newBooking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Update store optimistically
      addReservation(newBooking);
    },
  });
}

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
      return data.map((reservation) => ({
        ...reservation,
        start_time: new Date(reservation.start_time),
        end_time: new Date(reservation.end_time),
      }));
    },
  });

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
      return data.map((reservation) => ({
        ...reservation,
        start_time: new Date(reservation.start_time),
        end_time: new Date(reservation.end_time),
      }));
    },
    enabled: !!roomId,
  });

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
    mutationFn: async (bookingData: {
      room_id: number;
      start_time: Date;
      end_time: Date;
      title: string;
      description?: string;
    }) => {
      const { room_id, ...reservationData } = bookingData;
      const { data } = await api.post<Reservation>(
        `/rooms/${room_id}/reserve`,
        {
          ...reservationData,
          start_time: reservationData.start_time.toISOString(),
          end_time: reservationData.end_time.toISOString(),
        }
      );
      return data;
    },
    onSuccess: (newBooking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "room"] });
      addReservation(newBooking);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create booking";
      throw new Error(errorMessage);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Reservation } from "@/interfaces";
import { useBookingStore } from "@/store/bookingStore";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export function useBookings() {
  const { setReservations } = useBookingStore();
  const { isAuthenticated } = useUserStore();

  const query = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const { data } = await api.get<{ data: { items: Reservation[] } }>(
        "/bookings"
      );
      return data.data.items.map((reservation) => ({
        ...reservation,
        start_time: new Date(reservation.start_time),
        end_time: new Date(reservation.end_time),
      }));
    },
    enabled: !!isAuthenticated,
  });

  useEffect(() => {
    if (query.data) {
      setReservations(query.data);
    }
  }, [query.data, setReservations, isAuthenticated]);

  return query;
}

export function useRoomBookings(roomId: number) {
  const { setRoomReservations } = useBookingStore();
  const { isAuthenticated } = useUserStore();

  const query = useQuery({
    queryKey: ["bookings", "room", roomId, isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      const { data } = await api.get<{ data: { items: Reservation[] } }>(
        `/rooms/${roomId}/bookings`
      );

      const bookings = data.data.items.map((reservation) => ({
        ...reservation,
        start_time: new Date(reservation.start_time),
        end_time: new Date(reservation.end_time),
      }));

      return bookings;
    },
    enabled: !!roomId && !!isAuthenticated,
  });

  useEffect(() => {
    if (query.data) {
      setRoomReservations(query.data);
    }
  }, [query.data, setRoomReservations, isAuthenticated]);

  return query;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { setReservations, reservations } = useBookingStore();

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

      return {
        data,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
      };
    },
    onSuccess: (newBooking: { data: Reservation }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["bookings", "room", newBooking.data.room_id],
      });
      setReservations([...reservations, newBooking.data]);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create booking";
      throw new Error(errorMessage);
    },
  });
}

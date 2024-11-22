"use client";

import { Room, Reservation } from "@/interfaces";
import { create } from "zustand";

interface BookingStore {
  rooms: Room[];
  reservations: Reservation[];

  setRooms: (rooms: Room[]) => void;
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  updateRoom: (updatedRoom: Room) => void;
  deleteRoom: (roomId: number) => void;
  cancelReservation: (reservationId: number) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  rooms: [],
  reservations: [],

  setRooms: (rooms) => set({ rooms }),
  setReservations: (reservations) => set({ reservations }),

  addReservation: (reservation) =>
    set((state) => ({
      reservations: [...state.reservations, reservation],
    })),

  updateRoom: (updatedRoom) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === updatedRoom.id ? updatedRoom : room
      ),
    })),

  deleteRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),

  cancelReservation: (reservationId) =>
    set((state) => ({
      reservations: state.reservations.filter(
        (r) => r.id !== Number(reservationId)
      ),
    })),
}));

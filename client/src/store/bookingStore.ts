"use client";

import { Room, Reservation } from "@/interfaces";
import { create } from "zustand";

interface BookingStore {
  rooms: Room[];
  selectedRoom: Room | null;
  reservations: Reservation[];
  roomReservations: Reservation[];

  setRooms: (rooms: Room[]) => void;
  setSelectedRoom: (room: Room | null) => void;
  setReservations: (reservations: Reservation[]) => void;
  setRoomReservations: (reservations: Reservation[]) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  rooms: [],
  selectedRoom: null,
  reservations: [],
  roomReservations: [],

  setRooms: (rooms) => set({ rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setReservations: (reservations) => set({ reservations }),
  setRoomReservations: (reservations) =>
    set((state) => ({
      roomReservations: reservations,
    })),
}));

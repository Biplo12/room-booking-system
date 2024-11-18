"use client";

import { Room, Reservation } from "@/interfaces";
import { create } from "zustand";

interface BookingStore {
  rooms: Room[];
  reservations: Reservation[];

  setRooms: (rooms: Room[]) => void;
  setReservations: (reservations: Reservation[]) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  rooms: [
    {
      id: 1,
      name: "Executive Suite",
      capacity: 12,
      equipment: ["Projector", "Whiteboard", "Video Conference"],
      location: "Floor 1",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    },
    {
      id: 2,
      name: "Brainstorm Room",
      capacity: 6,
      equipment: ["Whiteboard", "TV Screen"],
      location: "Floor 2",
      imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    },
    {
      id: 3,
      name: "Innovation Lab",
      capacity: 8,
      equipment: ["Smart Board", "Video Conference"],
      location: "Floor 1",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    },
    {
      id: 4,
      name: "Focus Room",
      capacity: 4,
      equipment: ["TV Screen", "Whiteboard"],
      location: "Floor 3",
      imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7",
    },
  ],
  reservations: [],
  setRooms: (rooms) => set({ rooms }),
  setReservations: (reservations) => set({ reservations }),
}));

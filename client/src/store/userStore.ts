import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "@/lib/axios";

interface User {
  id: number;
  username: string;
  role: "user" | "admin";
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    Cookies.remove("access_token");
    delete api.defaults.headers.common["Authorization"];
    set({ user: null, isAuthenticated: false });
  },
}));

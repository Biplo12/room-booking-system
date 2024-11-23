"use client";

import { useSession } from "../hooks/auth";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  useSession();

  return (
    <>
      {children}
    </>
  );
}

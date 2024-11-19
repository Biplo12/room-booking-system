"use client";

import { Header } from "@/components/header";

export default function UserPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="grid gap-6"></div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomManagement } from "./_components/room-management";
import { BookingHistory } from "./_components/booking-history";
import { Analytics } from "./_components/analytics";
import { capitalize } from "@/lib/utils";

const TABS = ["rooms", "bookings", "analytics"];

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {capitalize(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="rooms">
            <RoomManagement />
          </TabsContent>
          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

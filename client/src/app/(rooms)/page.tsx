import { Header } from "@/components/header";
import { RoomList } from "./_components/room-list";

export default function RoomListPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <RoomList />
      </div>
    </div>
  );
}

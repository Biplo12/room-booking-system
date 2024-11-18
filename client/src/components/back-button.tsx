"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Rooms
    </Button>
  );
}

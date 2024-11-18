export interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
  location: string;
  imageUrl: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description?: string;
}

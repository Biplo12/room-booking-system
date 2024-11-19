export interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
  location: string;
  imageUrl: string;
}

export interface Reservation {
  id: number;
  roomId: number;
  userId: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description?: string;
}

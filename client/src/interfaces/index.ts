export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  image_url: string;
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

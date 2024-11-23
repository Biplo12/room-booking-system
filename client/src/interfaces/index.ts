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
  room_id: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
  title: string;
  description?: string;
}

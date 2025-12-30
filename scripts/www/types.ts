export interface Reservation {
  id: number;
  date: string;
  time: string;
  period: '中餐' | '晚餐';
  roomId: string;
  roomName: string;
  guests: string;
  name: string;
  contact: string;
}

export interface Room {
  id: string;
  name: string;
  capacity?: string;
}

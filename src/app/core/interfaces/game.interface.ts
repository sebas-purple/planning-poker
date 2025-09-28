export interface Game {
  id: string;
  name: string;
  owner?: string;    // Opcional porque se asignará después en game-room
  createdAt: Date;
}

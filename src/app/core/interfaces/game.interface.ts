import { User } from './user.interface';

export interface Game {
  id: string;
  name: string;
  owner?: string;    // Opcional porque se asignará después en game-room
  createdAt: Date;
  players: User[];   // Lista de jugadores en la partida
  selectedCards?: { [userId: string]: string | null };  // Mapeo de usuario a carta seleccionada
}

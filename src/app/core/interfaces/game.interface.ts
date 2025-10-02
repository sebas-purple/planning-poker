import { User } from './user.interface';

export interface Game {
  id: string;
  name: string;
  owner?: string;    // Opcional porque se asignará después en game-room
  createdAt: Date;
  players: User[];   // Lista de jugadores en la partida
  selectedCards?: SelectedCards;  // Mapeo de usuario a carta seleccionada
  isRevealed?: boolean;  // Estado de revelación de cartas (sincronizado entre jugadores)
}

// tipo para el mapeo de usuario a carta seleccionada
export type SelectedCards = { [userId: string]: string | null };
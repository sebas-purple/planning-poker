import { User } from './user.interface';
import { ScoringMode } from '../enums/scoring-mode.enum';

export interface Game {
  id: string;
  name: string;
  owner?: string;    // Opcional porque se asignará después en game-room
  createdAt: Date;
  players: User[];
  selectedCards?: SelectedCards;  // Mapeo de usuario a carta seleccionada
  isRevealed?: boolean;
  maxPlayers: number;
  scoringMode?: ScoringMode;
}

// tipo para el mapeo de usuario a carta seleccionada selectedCards
export type SelectedCards = { [userId: string]: string | null };
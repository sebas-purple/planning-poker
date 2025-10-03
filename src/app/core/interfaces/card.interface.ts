import { ScoringMode } from '../enums/scoring-mode.enum';

export interface Card {
  id: string;           // Identificador único de la carta
  score: string;        // Puntaje de la carta (no puede repetirse)
  text: string;         // Texto a mostrar en la carta
}

// Constante con los puntajes disponibles para Planning Poker por modo
export const SCORING_MODES_CARDS = {
  [ScoringMode.FIBONACCI]: ["0", "1", "3", "5", "8", "13", "21", "34", "55", "89", "?", "☕"],
  [ScoringMode.T_SHIRT]: ["XS", "S", "M", "L", "XL", "XXL", "?", "☕"],
  [ScoringMode.POWERS_OF_2]: ["0", "1", "2", "4", "8", "16", "32", "64", "?", "☕"],
  [ScoringMode.LINEAR]: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?", "☕"]
};

// Mantiene compatibilidad con el código existente
export const AVAILABLE_SCORES = SCORING_MODES_CARDS[ScoringMode.FIBONACCI];

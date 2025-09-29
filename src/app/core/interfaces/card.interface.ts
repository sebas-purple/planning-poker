export interface Card {
  id: string;           // Identificador único de la carta
  score: string;        // Puntaje de la carta (no puede repetirse)
  text: string;         // Texto a mostrar en la carta
  isSelected?: boolean; // Estado de selección de la carta
}

// Constante con los puntajes disponibles para Planning Poker
export const AVAILABLE_SCORES = ["0", "1", "3", "5", "8", "13", "21", "34", "55", "89", "?", "☕"];

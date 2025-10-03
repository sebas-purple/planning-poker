import { Injectable } from '@angular/core';
import { Card, SCORING_MODES_CARDS } from '../core/interfaces/card.interface';
import { ScoringMode } from '../core/enums/scoring-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class CardPoolService {
  private cards: Card[] = [];
  private currentScoringMode: ScoringMode = ScoringMode.FIBONACCI;

  constructor() {
    this.initializeCards();
  }

  // Inicializa el pool de cartas según el modo actual
  private initializeCards(): void {
    const scores = SCORING_MODES_CARDS[this.currentScoringMode];
    this.cards = scores.map(score => ({
      id: score,
      score: score,
      text: score,
    }));
  }

  // Cambiar modo de puntaje y regenerar cartas
  setScoringMode(mode: ScoringMode): void {
    this.currentScoringMode = mode;
    this.initializeCards();
  }

  getCurrentScoringMode(): ScoringMode {
    return this.currentScoringMode;
  }

  get getCards(): Card[] {
    return this.cards;
  }

}

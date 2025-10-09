import { Injectable, Signal, signal } from '@angular/core';
import { Card, SCORING_MODES_CARDS } from '../core/interfaces/card.interface';
import { ScoringMode } from '../core/enums/scoring-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class CardPoolSignalService {
  private readonly cardsSignal = signal<Card[]>([]);
  private readonly currentScoringMode = signal<ScoringMode>(
    ScoringMode.FIBONACCI
  );

  constructor() {
    this.initializeCards();
  }

  readonly getCurrentScoringMode: Signal<ScoringMode> =
    this.currentScoringMode.asReadonly();

  readonly getCards: Signal<Card[]> = this.cardsSignal.asReadonly();

  /**
   * Inicializa las cartas según el modo actual
   * @author Sebastian Aristizabal Castañeda
   */
  private initializeCards(): void {
    const scores = SCORING_MODES_CARDS[this.currentScoringMode()];
    this.cardsSignal.set(
      scores.map((score) => ({
        id: score,
        score: score,
        text: score,
      }))
    );
  }

  /**
   * Cambia el modo de puntuación y reinicia las cartas
   * @param mode - El modo de puntuación a establecer
   * @author Sebastian Aristizabal Castañeda
   */
  setScoringMode(mode: ScoringMode): void {
    this.currentScoringMode.set(mode);
    console.log('setScoringMode: Modo de puntuación cambiado a:', mode);
    this.initializeCards();
  }
}

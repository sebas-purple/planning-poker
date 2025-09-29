import { Injectable } from '@angular/core';
import { Card, AVAILABLE_SCORES } from '../core/interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardPoolService {
  private cards: Card[] = [];

  constructor() {
    this.initializeCards();
  }

  // Inicializa el pool de cartas
  private initializeCards(): void {
    this.cards = AVAILABLE_SCORES.map(score => ({
      id: score,
      score: score,
      text: score,
    }));
  }

  // convertir a un getter
  get getCards(): Card[] {
    return this.cards;
  }

}

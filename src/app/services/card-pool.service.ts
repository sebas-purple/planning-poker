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
      id: crypto.randomUUID(),
      score: score,
      text: score,
      isSelected: false
    }));
  }

  // convertir a un getter
  get getCards(): Card[] {
    return this.cards;
  }

  // Solo se puede seleccionar una unica carta
  selectCard(cardId: string): void {
    this.cards.forEach(card => card.isSelected = false);
    const selectedCard = this.cards.find(card => card.id === cardId);
    if (selectedCard) {
      selectedCard.isSelected = true;
    }
  }

}

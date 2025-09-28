import { Injectable } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGame: Game | null = null;

  constructor() { }

  createGame(name: string): Game {
    const newGame: Game = {
      id: crypto.randomUUID(), // Genera un ID único
      name: name.trim(),
      createdAt: new Date()
    };
    
    this.currentGame = newGame;
    return newGame;
  }

  setGameOwner(owner: string): void {
    if (this.currentGame) {
      this.currentGame = {
        ...this.currentGame,
        owner
      };
    }
  }

  getCurrentGame(): Game | null {
    return this.currentGame;
  }
}

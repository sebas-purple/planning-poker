import { Injectable, signal } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';
import { ScoringMode } from '../core/enums/scoring-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class GameSignalService {
  private gameSignal = signal<Game | null>(null);
  private readonly maxPlayers: number = 8;

  constructor() {}

  getGameSignal = this.gameSignal.asReadonly();

  createGame(name: string): void {
    const newGame: Game = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date(),
      players: [],
      selectedCards: {},
      isRevealed: false,
      maxPlayers: this.maxPlayers,
      scoringMode: ScoringMode.FIBONACCI,
    };

    this.gameSignal.set(newGame);
    // this.saveGameToStorage();
  }
}

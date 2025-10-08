import { Injectable, signal } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';
import { ScoringMode } from '../core/enums/scoring-mode.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameSignalService {
  private gameSignal = signal<Game | null>(null);
  private readonly maxPlayers: number = 8;
  private readonly gameSubject = new BehaviorSubject<Game | null>(null);
  public game$: Observable<Game | null> = this.gameSubject.asObservable();

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
    this.saveGameToStorage();
  }

  private saveGameToStorage(): void {
    if (this.gameSignal()) {
      localStorage.setItem(
        `planning-poker-game-${this.gameSignal()?.id}`,
        JSON.stringify(this.gameSignal)
      );
      this.gameSubject.next(this.gameSignal());
    }
  }

  /**
   * Carga un juego desde localStorage.
   *
   * @param gameId El id del juego a cargar.
   * @author Sebastian Aristizabal Castañeda
   */
  loadGameFromStorage(gameId: string): void {
    try {
      const gameData = localStorage.getItem(`planning-poker-game-${gameId}`);
      if (gameData) {
        const game = JSON.parse(gameData);
        // Convertir fecha string de vuelta a Date
        game.createdAt = new Date(game.createdAt);
        // Asegurar que tenga un modo de puntaje por defecto
        if (!game.scoringMode) {
          game.scoringMode = ScoringMode.FIBONACCI;
        }
        this.gameSignal.set(game);

        // Notificar que se cargó un juego
        this.gameSubject.next(game);
      }
    } catch (error) {
      console.error('Error al cargar juego desde localStorage:', error);
    }
  }

  /**
   * Verifica si el juego tiene el máximo de jugadores permitidos.
   *
   * @returns true si el juego tiene el máximo de jugadores permitidos, false en caso contrario.
   * @author Sebastian Aristizabal Castañeda
   */
  hasMaxPlayers(): boolean {
    return this.gameSignal()?.players.length === this.maxPlayers;
  }
}

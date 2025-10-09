import { computed, Injectable, Signal, signal } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';
import { ScoringMode } from '../core/enums/scoring-mode.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GameSignalService {
  private gameSignal = signal<Game | null>(null);
  private readonly maxPlayers: number = 8;
  private readonly gameSubject = new BehaviorSubject<Game | null>(null);
  public game$: Observable<Game | null> = this.gameSubject.asObservable();

  constructor() {
    this.setupStorageListener();
  }

  // Configurar listener para cambios en localStorage desde otras pestañas
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      // Solo procesar cambios de juegos de planning poker
      if (
        event.key &&
        event.key.startsWith('planning-poker-game-') &&
        event.newValue
      ) {
        try {
          const updatedGame = JSON.parse(event.newValue);
          // Convertir fecha string de vuelta a Date
          updatedGame.createdAt = new Date(updatedGame.createdAt);

          // Si es el juego actual, actualizarlo
          if (this.gameSignal() && this.gameSignal()?.id === updatedGame.id) {
            this.gameSignal.set(updatedGame);
            this.gameSubject.next(updatedGame);
          }
        } catch (error) {
          console.error('Error al procesar cambio de localStorage:', error);
        }
      }
    });
  }

  getGameSignal: Signal<Game | null> = this.gameSignal.asReadonly();
  readonly isGameLoaded: Signal<boolean> = computed(
    () => this.gameSignal() !== null
  );
  readonly hasMaxPlayers: Signal<boolean> = computed(
    () => this.gameSignal()?.players.length === this.maxPlayers
  );

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
        JSON.stringify(this.gameSignal())
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
        console.log('Juego cargado desde localStorage:', game);
      } else {
        console.log(
          'loadGameFromStorage: No se encontró el juego en localStorage'
        );
      }
    } catch (error) {
      console.error('Error al cargar juego desde localStorage:', error);
    }
  }

  setGameOwner(ownerId: string): void {
    const currentGame = this.gameSignal();

    if (currentGame) {
      const updatedGame: Game = {
        ...currentGame,
        owner: ownerId,
      };

      this.gameSignal.set(updatedGame);
      this.saveGameToStorage();
    }
  }

  addPlayer(player: User): void {
    const currentGame = this.gameSignal();

    if (!currentGame) return;

    if (this.hasMaxPlayers()) {
      console.log('No hay cupo para más jugadores');
      return;
    }

    const updatedGame: Game = {
      ...currentGame,
      players: [...currentGame.players, player], // crea nuevo array
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('Jugador agregado con signal:', player);
  }
}

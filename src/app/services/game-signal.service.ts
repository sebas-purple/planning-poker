import { computed, Injectable, Signal, signal } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';
import {
  SCORING_MODE_LABELS,
  ScoringMode,
} from '../core/enums/scoring-mode.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../core/interfaces/user.interface';
import { UserSignalService } from './user-signal.service';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class GameSignalService {
  private gameSignal = signal<Game | null>(null);
  private readonly maxPlayers: number = 8;
  private readonly gameSubject = new BehaviorSubject<Game | null>(null);
  public game$: Observable<Game | null> = this.gameSubject.asObservable();

  constructor(private userSignalService: UserSignalService) {
    this.setupStorageListener();
  }

  /**
   * Obtiene la señal del juego.
   * @author Sebastian Aristizabal Castañeda
   */
  getGameSignal: Signal<Game | null> = this.gameSignal.asReadonly();

  readonly isGameLoaded: Signal<boolean> = computed(
    () => this.gameSignal() !== null
  );

  readonly hasMaxPlayers: Signal<boolean> = computed(
    () => this.gameSignal()?.players.length === this.maxPlayers
  );

  readonly isAdmin: Signal<boolean> = computed(() => {
    const game = this.gameSignal();
    const user = this.userSignalService.getUserSignal();

    if (!game || !user) return false;

    // Owner siempre es admin
    if (game.owner === user.id) return true;

    // Buscar si el usuario tiene rol de admin
    const player = game.players.find((p) => p.id === user.id);
    return player?.rol === UserRole.administrador;
  });

  readonly canChangeScoringMode: Signal<boolean> = computed(() => {
    if (!this.isAdmin()) return false;

    return !this.gameSignal()?.isRevealed;
  });

  readonly getCurrentScoringMode: Signal<string> = computed(() => {
    const mode = this.gameSignal()?.scoringMode || ScoringMode.FIBONACCI;
    return SCORING_MODE_LABELS[mode];
  });

  readonly hasAtLeastOnePlayerSelectedCard: Signal<boolean> = computed(() => {
    const game = this.gameSignal();
    return game ? Object.keys(game.selectedCards || {}).length > 0 : false;
  });

  readonly getPlayerSelectedCard: Signal<string | null> = computed(() => {
    const game = this.gameSignal();
    const user = this.userSignalService.getUserSignal();

    return game?.selectedCards?.[user?.id ?? ''] || null;
  });

  readonly getIsRevealed: Signal<boolean> = computed(() => {
    const game = this.gameSignal();
    return game?.isRevealed || false;
  });

  readonly votesCount: Signal<Record<string, number>> = computed(() => {
    const game = this.gameSignal();
    if (!game?.selectedCards) return {};

    const votes: Record<string, number> = {};

    game.players.forEach((player) => {
      const card = game.selectedCards?.[player.id];
      const isSpectator = player.viewMode === ViewMode.espectador;

      if (card && !isSpectator) {
        votes[card] = (votes[card] || 0) + 1;
      }
    });

    return votes;
  });

  readonly getVotesCountArray: Signal<{ value: string; count: number }[]> =
    computed(() => {
      return Object.entries(this.votesCount())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
    });

  readonly getAverageScore: Signal<string> = computed(() => {
    const game = this.gameSignal();
    if (!game?.selectedCards) return '0';

    // Si el modo de puntaje es T_SHIRT, no tiene sentido calcular promedio
    if (game.scoringMode === ScoringMode.T_SHIRT) return '';

    let sum = 0;
    let count = 0;

    game.players.forEach((player) => {
      if (player.viewMode === ViewMode.espectador) return;

      const card = game.selectedCards?.[player.id];
      const numeric = parseFloat(card ?? '');

      if (!isNaN(numeric)) {
        sum += numeric;
        count++;
      }
    });

    const result = count > 0 ? Number((sum / count).toFixed(1)) : 0;

    // Reemplazar punto por coma
    return result.toString().replace('.', ',');
  });

  readonly canSelectCard: Signal<boolean> = computed(() => {
    return this.userSignalService.getViewMode() && !this.getIsRevealed();
  });

  /**
   * Configura un listener para cambios en localStorage.
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Crea un juego.
   * @param name El nombre del juego.
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Guarda el juego en localStorage.
   * @author Sebastian Aristizabal Castañeda
   */
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
        console.log(
          'loadGameFromStorage: Juego cargado desde localStorage:',
          game
        );
      } else {
        console.log(
          'loadGameFromStorage: No se encontró el juego en localStorage'
        );
      }
    } catch (error) {
      console.error(
        'loadGameFromStorage: Error al cargar juego desde localStorage:',
        error
      );
    }
  }

  /**
   * Establece el propietario del juego.
   * @param ownerId El id del propietario.
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Agrega un jugador al juego.
   * @param player El jugador a agregar.
   * @author Sebastian Aristizabal Castañeda
   */
  addPlayer(player: User): void {
    const currentGame = this.gameSignal();

    if (!currentGame) return;

    if (this.hasMaxPlayers()) {
      console.log('addPlayer: No hay cupo para más jugadores');
      return;
    }

    const updatedGame: Game = {
      ...currentGame,
      players: [...currentGame.players, player], // crea nuevo array
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('addPlayer: Jugador agregado:', player);
  }

  /**
   * Cambia el modo de puntuación.
   * @param newMode El nuevo modo de puntuación.
   * @author Sebastian Aristizabal Castañeda
   */
  changeScoringMode(newMode: ScoringMode): void {
    if (!this.gameSignal()) return;

    if (!this.isAdmin()) return;

    if (this.gameSignal()?.isRevealed) return;

    // Resetear votos si hay alguno
    const selectedCards = this.hasAtLeastOnePlayerSelectedCard()
      ? {}
      : this.gameSignal()?.selectedCards;

    // Cambiar el modo
    const updatedGame: Game = {
      ...this.gameSignal()!,
      scoringMode: newMode,
      selectedCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
  }

  /**
   * Selecciona una carta.
   * @param cardId La carta seleccionada.
   * @author Sebastian Aristizabal Castañeda
   */
  selectCard(cardId: string): void {
    const game = this.gameSignal();
    const user = this.userSignalService.getUserSignal();

    if (!game) return;

    const updatedSelectedCards = {
      ...(game.selectedCards || {}),
      [user?.id ?? '']: cardId,
    };

    const updatedGame: Game = {
      ...game,
      selectedCards: updatedSelectedCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
  }

  /**
   * Deselecciona una carta.
   * @author Sebastian Aristizabal Castañeda
   */
  unselectCard(): void {
    const game = this.gameSignal();
    const user = this.userSignalService.getUserSignal();

    if (!game || !game.selectedCards?.[user?.id ?? '']) return;

    const { [user?.id ?? '']: removed, ...remainingCards } = game.selectedCards;

    const updatedGame: Game = {
      ...game,
      selectedCards: remainingCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
  }
}

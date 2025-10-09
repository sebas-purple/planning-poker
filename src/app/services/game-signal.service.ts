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
  private readonly gameSignal = signal<Game | null>(null);
  private readonly maxPlayers: number = 8;
  private readonly gameSubject = new BehaviorSubject<Game | null>(null);
  public game$: Observable<Game | null> = this.gameSubject.asObservable();

  constructor(private readonly userSignalService: UserSignalService) {
    this.setupStorageListener();
  }

  // señales computadas

  getGameSignal: Signal<Game | null> = this.gameSignal.asReadonly();

  readonly isGameLoaded: Signal<boolean> = computed(
    () => this.gameSignal() !== null
  );

  readonly getGameName: Signal<string> = computed(() => {
    const game = this.gameSignal();
    return game?.name || '';
  });

  readonly hasMaxPlayers: Signal<boolean> = computed(
    () => this.gameSignal()?.players.length === this.maxPlayers
  );

  readonly canChangeScoringMode: Signal<boolean> = computed(() => {
    const user = this.userSignalService.getUserSignal();
    const currentGame = this.gameSignal();

    if (!user || !currentGame) return false;

    if (!this.isAdmin(user.id, currentGame)) return false;

    return !currentGame?.isRevealed;
  });

  readonly getCurrentScoringMode: Signal<string> = computed(() => {
    const mode = this.gameSignal()?.scoringMode || ScoringMode.FIBONACCI;
    return SCORING_MODE_LABELS[mode];
  });

  readonly hasAtLeastOnePlayerSelectedCard: Signal<boolean> = computed(() => {
    const game = this.gameSignal();
    return game ? Object.keys(game.selectedCards || {}).length > 0 : false;
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

    return result.toString().replace('.', ',');
  });

  readonly canSelectCard: Signal<boolean> = computed(() => {
    const currentUser = this.userSignalService.getUserSignal();
    const isRevealed = this.getIsRevealed();
    return currentUser?.viewMode === ViewMode.jugador && !isRevealed;
  });

  readonly inviteLink: Signal<string> = computed(() => {
    if (!this.gameSignal()) {
      console.log('generateInviteLink: No hay juego activo para generar link');
      return 'https://planning-poker.com/game/1234567890';
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-game/${this.gameSignal()?.id}`;
  });

  readonly isButtonRevealCardsVisible: Signal<boolean> = computed(() => {
    const user = this.userSignalService.getUserSignal();
    const game = this.gameSignal();

    if (!user || !game) return false;

    return (
      this.isAdmin(user.id, game) && this.hasAtLeastOnePlayerSelectedCard()
    );
  });

  readonly getPlayers: Signal<User[]> = computed(() => {
    return this.gameSignal()?.players || [];
  });

  // metodos

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
    console.log('createGame: Juego creado:', newGame);
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
      console.log('setGameOwner: Propietario establecido:', ownerId);
    } else {
      console.log('setGameOwner: Juego no encontrado');
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
    const user = this.userSignalService.getUserSignal();
    const currentGame = this.gameSignal();

    if (!user || !currentGame) return;

    if (!this.isAdmin(user.id, currentGame)) return;

    if (currentGame.isRevealed) return;

    // Resetear votos si hay alguno
    const selectedCards = this.hasAtLeastOnePlayerSelectedCard()
      ? {}
      : currentGame.selectedCards;

    // Cambiar el modo
    const updatedGame: Game = {
      ...currentGame,
      scoringMode: newMode,
      selectedCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('changeScoringMode: Modo de puntuación cambiado:', newMode);
  }

  /**
   * Selecciona una carta.
   * @param cardId La carta seleccionada.
   * @author Sebastian Aristizabal Castañeda
   */
  selectCard(cardId: string): void {
    const currentGame = this.gameSignal();

    const user = this.userSignalService.getUserSignal();

    if (!currentGame) return;

    const updatedSelectedCards = {
      ...(currentGame.selectedCards || {}),
      [user?.id ?? '']: cardId,
    };

    const updatedGame: Game = {
      ...currentGame,
      selectedCards: updatedSelectedCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('selectCard: Carta seleccionada:', cardId);
  }

  /**
   * Deselecciona una carta.
   * @author Sebastian Aristizabal Castañeda
   */
  unselectCard(): void {
    const currentGame = this.gameSignal();
    const user = this.userSignalService.getUserSignal();

    if (!currentGame || !currentGame.selectedCards?.[user?.id ?? '']) return;

    const { [user?.id ?? '']: removed, ...remainingCards } =
      currentGame.selectedCards;

    const updatedGame: Game = {
      ...currentGame,
      selectedCards: remainingCards,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('unselectCard: Carta deseleccionada');
  }

  /**
   * Actualiza un jugador.
   * @param updatedPlayer El jugador a actualizar.
   * @author Sebastian Aristizabal Castañeda
   */
  updatePlayer(updatedPlayer: User): void {
    const currentGame = this.gameSignal();

    if (currentGame) {
      const playerIndex = currentGame.players.findIndex(
        (p) => p.id === updatedPlayer.id
      );

      if (playerIndex !== -1) {
        const updatedPlayers = [...currentGame.players];
        updatedPlayers[playerIndex] = updatedPlayer;

        const updatedGame: Game = {
          ...currentGame,
          players: updatedPlayers,
        };

        this.gameSignal.set(updatedGame);
        this.saveGameToStorage(); // actualiza el storage
        console.log('updatePlayer: Jugador actualizado:', updatedPlayer);
      } else {
        console.log('updatePlayer: Jugador no encontrado');
      }
    } else {
      console.log('updatePlayer: Juego no encontrado');
    }
  }

  /**
   * Revela las cartas.
   * @author Sebastian Aristizabal Castañeda
   */
  revealCards(): void {
    const game = this.gameSignal();

    if (game) {
      const updatedGame: Game = {
        ...game,
        isRevealed: true,
      };

      this.gameSignal.set(updatedGame);
      this.saveGameToStorage();
      console.log('revealCards: Cartas reveladas');
    } else {
      console.log('revealCards: Juego no encontrado');
    }
  }

  /**
   * Inicia una nueva votación.
   * @author Sebastian Aristizabal Castañeda
   */
  startNewVoting(): void {
    const game = this.gameSignal();

    if (game) {
      const updatedGame: Game = {
        ...game,
        isRevealed: false,
      };

      this.gameSignal.set(updatedGame);
      this.resetGame();
      console.log('startNewVoting: Nueva votación iniciada');
    } else {
      console.log('startNewVoting: Juego no encontrado');
    }
  }

  /**
   * Reinicia el juego.
   * @author Sebastian Aristizabal Castañeda
   */
  resetGame(): void {
    const game = this.gameSignal();

    if (game) {
      const updatedGame: Game = {
        ...game,
        selectedCards: {}, // limpiamos las cartas seleccionadas
      };

      this.gameSignal.set(updatedGame);
      this.saveGameToStorage();
      console.log('resetGame: Juego reiniciado');
    } else {
      console.log('resetGame: Juego no encontrado');
    }
  }

  /**
   * Verifica si un usuario es administrador.
   * @param userId El id del usuario.
   * @param game El juego.
   * @author Sebastian Aristizabal Castañeda
   */
  isAdmin(userId: string, game: Game | null): boolean {
    if (!game) return false;

    if (this.isGameOwner(userId, game)) return true;

    const player = game.players.find((p) => p.id === userId);
    return player?.rol === UserRole.administrador;
  }

  /**
   * Verifica si un usuario es el propietario del juego.
   * @param userId El id del usuario.
   * @param game El juego.
   * @author Sebastian Aristizabal Castañeda
   */
  isGameOwner(userId: string, game: Game): boolean {
    return game.owner === userId;
  }

  /**
   * Promueve un usuario a administrador.
   * @param userId El id del usuario.
   * @param promoterId El id del promotor.
   * @author Sebastian Aristizabal Castañeda
   */
  promoteToAdmin(userId: string, promoterId: string): void {
    const game = this.gameSignal();

    if (!game) return;

    if (!this.isAdmin(promoterId, game)) return;
    if (this.isGameOwner(userId, game)) return;

    const playerIndex = game.players.findIndex((p) => p.id === userId);
    if (playerIndex === -1) return;

    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      rol: UserRole.administrador,
    };

    const updatedGame: Game = {
      ...game,
      players: updatedPlayers,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('promoteToAdmin: Usuario promovido a administrador:', userId);
  }

  /**
   * Degrada un usuario de administrador a jugador.
   * @param userId El id del usuario.
   * @param demoterId El id del degradador.
   * @author Sebastian Aristizabal Castañeda
   */
  demoteFromAdmin(userId: string, demoterId: string): void {
    const game = this.gameSignal();

    if (!game) return;

    if (!this.isAdmin(demoterId, game)) return;
    if (this.isGameOwner(userId, game)) return;

    const playerIndex = game.players.findIndex((p) => p.id === userId);
    if (
      playerIndex === -1 ||
      game.players[playerIndex].rol !== UserRole.administrador
    ) {
      return;
    }

    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      rol: UserRole.jugador,
    };

    const updatedGame: Game = {
      ...game,
      players: updatedPlayers,
    };

    this.gameSignal.set(updatedGame);
    this.saveGameToStorage();
    console.log('demoteFromAdmin: Usuario degradado de administrador:', userId);
  }

  /**
   * Verifica si un usuario ha seleccionado una carta.
   * @param userId El id del usuario.
   * @author Sebastian Aristizabal Castañeda
   */
  hasPlayerSelectedCard(userId: string): boolean {
    const game = this.gameSignal();
    return !!game?.selectedCards?.[userId];
  }

  /**
   * Obtiene la carta seleccionada por un usuario.
   * @param userId El id del usuario.
   * @author Sebastian Aristizabal Castañeda
   */
  getPlayerSelectedCard(userId: string): string | null {
    const game = this.gameSignal();
    return game?.selectedCards?.[userId] || null;
  }
}

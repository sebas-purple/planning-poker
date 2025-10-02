import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game, SelectedCards } from '../core/interfaces/game.interface';
import { User } from '../core/interfaces/user.interface';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGame: Game | null = null;

  // BehaviorSubject para notificar cambios del juego
  private readonly gameSubject = new BehaviorSubject<Game | null>(null);
  public game$: Observable<Game | null> = this.gameSubject.asObservable();

  constructor() { 
    this.setupStorageListener();
  }

  // Configurar listener para cambios en localStorage desde otras pestañas
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      // Solo procesar cambios de juegos de planning poker
      if (event.key && event.key.startsWith('planning-poker-game-') && event.newValue) {
        try {
          const updatedGame = JSON.parse(event.newValue);
          // Convertir fecha string de vuelta a Date
          updatedGame.createdAt = new Date(updatedGame.createdAt);
          
          // Si es el juego actual, actualizarlo
          if (this.currentGame && this.currentGame.id === updatedGame.id) {
            this.currentGame = updatedGame;
            this.gameSubject.next(updatedGame);
          }
        } catch (error) {
          console.error('Error al procesar cambio de localStorage:', error);
        }
      }
    });
  }

  createGame(name: string): Game {
    const newGame: Game = {
      id: crypto.randomUUID(), // Genera un ID único
      name: name.trim(),
      createdAt: new Date(),
      players: [],
      selectedCards: {},
      isRevealed: false  // Inicializar estado de revelación
    };
    
    this.currentGame = newGame;
    this.saveGameToStorage(); // Guardar inmediatamente en localStorage
    return newGame;
  }

  setGameOwner(ownerId: string): void {
    if (this.currentGame) {
      this.currentGame = {
        ...this.currentGame,
        owner: ownerId
      };
      this.saveGameToStorage(); // Guardar cambios
    }
  }

  get getCurrentGame(): Game | null {
    return this.currentGame;
  }

  addPlayer(player: User): void {
    if (this.currentGame) {
      this.currentGame.players.push(player);
      this.saveGameToStorage(); // Guardar cambios
    }
  }

  // Método para manejar la selección de cartas
  selectCard(userId: string, cardId: string): void {
    if (this.currentGame) {
      // Inicializar selectedCards si no existe
      this.currentGame.selectedCards ??= {};
      // Actualizar el estado de selección en el juego
      this.currentGame.selectedCards[userId] = cardId;
      this.saveGameToStorage(); // Guardar cambios
    }
  }

  // Método para deseleccionar carta
  unselectCard(userId: string): void {
    if (this.currentGame) {
      delete this.currentGame.selectedCards?.[userId];
      this.saveGameToStorage(); // Guardar cambios
    }
  }

  // Método para verificar si un jugador ha seleccionado carta
  hasPlayerSelectedCard(userId: string): boolean {
    return this.currentGame ? !!this.currentGame.selectedCards?.[userId] : false;
  }

  // Método para obtener la carta seleccionada de un jugador
  getPlayerSelectedCard(userId: string): string | null {
    return this.currentGame?.selectedCards?.[userId] || null;
  }

  // Método para verificar si todos los jugadores han seleccionado carta
  hasAllPlayersSelectedCard(): boolean {
    return this.currentGame ? Object.keys(this.currentGame.selectedCards || {}).length === this.currentGame.players.length : false;
  }

  // metodo para verificar si almenos un jugador ha seleccionado carta
  hasAtLeastOnePlayerSelectedCard(): boolean {
    return this.currentGame ? Object.keys(this.currentGame.selectedCards || {}).length > 0 : false;
  }


  addMockPlayers(): void {
    const mockPlayers = this.generateMockPlayers();
    mockPlayers.forEach(player => this.addPlayer(player));
  }

  generateMockPlayers(): User[] {
    const mockPlayers = [
      {
        id: crypto.randomUUID(),
        name: 'Juan',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        id: crypto.randomUUID(),
        name: 'María',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        id: crypto.randomUUID(),
        name: 'Carlos',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        id: crypto.randomUUID(),
        name: 'Ana',
        rol: UserRole.otro,
        viewMode: ViewMode.espectador
      },
      {
        id: crypto.randomUUID(),
        name: 'Pedro',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        id: crypto.randomUUID(),
        name: 'Laura',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        id: crypto.randomUUID(),
        name: 'Diego',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      }
    ];

    return mockPlayers;
  }

  addMockSelectedCardsToSelectedCards(): void {
    if (this.currentGame) {
      this.currentGame.selectedCards = this.generateMockSelectedCards();
    }
  }

  // crear mock de selectedCards
  generateMockSelectedCards(): SelectedCards {
    // los valores son los puntajes de las cartas ["0", "1", "3", "5", "8", "13", "21", "34", "55", "89", "?", "☕"]
    const mockSelectedCards: SelectedCards = {
      [this.currentGame?.players[1].id || '']: '0',
      [this.currentGame?.players[2].id || '']: '1',
      [this.currentGame?.players[3].id || '']: '3',
      [this.currentGame?.players[4].id || '']: '5',
      [this.currentGame?.players[5].id || '']: '8',
      [this.currentGame?.players[6].id || '']: '13',
      [this.currentGame?.players[7].id || '']: '21',
    };

    return mockSelectedCards;
  }

  isGameOwner(userId: string): boolean {
    return this.currentGame?.owner === userId;
  }

  // Generar link de invitación
  generateInviteLink(): string {
    if (!this.currentGame) {
      throw new Error('No hay juego activo para generar link');
    }
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-game/${this.currentGame.id}`;
  }

  // Guardar juego en localStorage y notificar cambios
  private saveGameToStorage(): void {
    if (this.currentGame) {
      localStorage.setItem(`planning-poker-game-${this.currentGame.id}`, JSON.stringify(this.currentGame));
      // Notificar a todos los suscriptores del cambio
      this.gameSubject.next(this.currentGame);
    }
  }

  // Cargar juego desde localStorage
  loadGameFromStorage(gameId: string): Game | null {
    try {
      const gameData = localStorage.getItem(`planning-poker-game-${gameId}`);
      if (gameData) {
        const game = JSON.parse(gameData);
        // Convertir fecha string de vuelta a Date
        game.createdAt = new Date(game.createdAt);
        this.currentGame = game;
        // Notificar que se cargó un juego
        this.gameSubject.next(game);
        return game;
      }
    } catch (error) {
      console.error('Error al cargar juego desde localStorage:', error);
    }
    return null;
  }

  // Verificar si existe un juego en localStorage
  gameExistsInStorage(gameId: string): boolean {
    return localStorage.getItem(`planning-poker-game-${gameId}`) !== null;
  }

  // Obtener el conteo de votos por carta
  getVotesCount(): { [cardValue: string]: number } {
    if (!this.currentGame?.selectedCards) return {};

    const votesCount: { [cardValue: string]: number } = {};
    const players = this.currentGame.players;

    Object.entries(this.currentGame.selectedCards).forEach(([userId, cardId]) => {
      // Verificar que el usuario no sea espectador
      const player = players.find(p => p.id === userId);
      if (player && player.viewMode !== ViewMode.espectador) {
        votesCount[cardId || ''] = (votesCount[cardId || ''] || 0) + 1;
      }
    });

    return votesCount;
  }

  // Calcular el promedio de los votos (excluyendo espectadores)
  calculateAverageScore(): number {
    if (!this.currentGame?.selectedCards) return 0;

    const players = this.currentGame.players;
    let sum = 0;
    let count = 0;

    Object.entries(this.currentGame.selectedCards).forEach(([userId, cardId]) => {
      // Verificar que el usuario no sea espectador
      const player = players.find(p => p.id === userId);
      if (player && player.viewMode !== ViewMode.espectador) {
        const numericValue = parseFloat(cardId || '0');
        if (!isNaN(numericValue)) { // Solo contar valores numéricos
          sum += numericValue;
          count++;
        }
      }
    });

    return count > 0 ? Number((sum / count).toFixed(1)) : 0;
  }

  // reiniciar la partida
  resetGame(): void {
    if (this.currentGame) {
      this.currentGame.selectedCards = {};
      this.saveGameToStorage(); // Guardar cambios
    }
  }

  // Getter para isRevealed
  get getIsRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  // Revelar cartas
  revealCards(): void {
    if (this.currentGame) {
      this.currentGame.isRevealed = true;
      this.saveGameToStorage(); // Guardar cambios para sincronizar
    }
  }

  // Iniciar nueva votación
  startNewVoting(): void {
    if (this.currentGame) {
      this.currentGame.isRevealed = false;
      this.resetGame(); // resetGame ya guarda los cambios
    }
  }
}

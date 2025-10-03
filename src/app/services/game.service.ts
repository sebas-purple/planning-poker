import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../core/interfaces/game.interface';
import { User } from '../core/interfaces/user.interface';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';
import { ScoringMode } from '../core/enums/scoring-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGame: Game | null = null;
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
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date(),
      players: [],
      selectedCards: {},
      isRevealed: false,
      maxPlayers: this.maxPlayers,
      scoringMode: ScoringMode.FIBONACCI
    };
    
    this.currentGame = newGame;
    this.saveGameToStorage();
    return newGame;
  }

  setGameOwner(ownerId: string): void {
    if (this.currentGame) {
      this.currentGame = {
        ...this.currentGame,
        owner: ownerId
      };
      this.saveGameToStorage();
    }
  }

  get getCurrentGame(): Game | null {
    return this.currentGame;
  }

  addPlayer(player: User): void {
    if (this.currentGame) {
      if (this.hasMaxPlayers()) {
        console.log('No hay cupo para mas jugadores');
        return;
      }
      this.currentGame.players.push(player);
      this.saveGameToStorage();
    }
  }

  updatePlayer(updatedPlayer: User): boolean {
    if (this.currentGame) {
      const playerIndex = this.currentGame.players.findIndex(p => p.id === updatedPlayer.id);
      if (playerIndex !== -1) {
        this.currentGame.players[playerIndex] = updatedPlayer;
        this.saveGameToStorage();
        this.gameSubject.next(this.currentGame); // Notificar cambios
        return true;
      }
    }
    return false;
  }

  // Método para manejar la selección de cartas
  selectCard(userId: string, cardId: string): void {
    if (this.currentGame) {
      this.currentGame.selectedCards ??= {};
      this.currentGame.selectedCards[userId] = cardId;
      this.saveGameToStorage();
    }
  }

  unselectCard(userId: string): void {
    if (this.currentGame) {
      delete this.currentGame.selectedCards?.[userId];
      this.saveGameToStorage();
    }
  }

  hasPlayerSelectedCard(userId: string): boolean {
    return this.currentGame ? !!this.currentGame.selectedCards?.[userId] : false;
  }

  getPlayerSelectedCard(userId: string): string | null {
    return this.currentGame?.selectedCards?.[userId] || null;
  }

  hasAllPlayersSelectedCard(): boolean {
    return this.currentGame ? Object.keys(this.currentGame.selectedCards || {}).length === this.currentGame.players.length : false;
  }

  hasAtLeastOnePlayerSelectedCard(): boolean {
    return this.currentGame ? Object.keys(this.currentGame.selectedCards || {}).length > 0 : false;
  }

  isGameOwner(userId: string): boolean {
    return this.currentGame?.owner === userId;
  }

  // Verificar si un usuario es administrador (propietario o administrador)
  isAdmin(userId: string): boolean {
    if (!this.currentGame) return false;
    
    // El propietario siempre es admin
    if (this.isGameOwner(userId)) return true;
    
    // Verificar si tiene rol de administrador
    const player = this.currentGame.players.find(p => p.id === userId);
    return player?.rol === UserRole.administrador;
  }

  // Promover un jugador a administrador
  promoteToAdmin(userId: string, promoterId: string): boolean {
    if (!this.currentGame) return false;
    
    // Solo el propietario o administradores pueden promover
    if (!this.isAdmin(promoterId)) return false;
    
    const playerIndex = this.currentGame.players.findIndex(p => p.id === userId);
    if (playerIndex !== -1) {
      // No se puede promover al propietario (ya es admin)
      if (this.isGameOwner(userId)) return false;
      
      this.currentGame.players[playerIndex].rol = UserRole.administrador;
      this.saveGameToStorage();
      this.gameSubject.next(this.currentGame);
      return true;
    }
    return false;
  }

  // Degradar un administrador a jugador
  demoteFromAdmin(userId: string, demoterId: string): boolean {
    if (!this.currentGame) return false;
    
    // Solo el propietario o administradores pueden degradar
    if (!this.isAdmin(demoterId)) return false;
    
    // No se puede degradar al propietario
    if (this.isGameOwner(userId)) return false;
    
    const playerIndex = this.currentGame.players.findIndex(p => p.id === userId);
    if (playerIndex !== -1 && this.currentGame.players[playerIndex].rol === UserRole.administrador) {
      this.currentGame.players[playerIndex].rol = UserRole.jugador;
      this.saveGameToStorage();
      this.gameSubject.next(this.currentGame);
      return true;
    }
    return false;
  }

  // Obtener lista de administradores (incluyendo propietario)
  getAdmins(): User[] {
    if (!this.currentGame) return [];
    
    return this.currentGame.players.filter(player => 
      this.isGameOwner(player.id) || player.rol === UserRole.administrador
    );
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
        // Asegurar que tenga un modo de puntaje por defecto
        if (!game.scoringMode) {
          game.scoringMode = ScoringMode.FIBONACCI;
        }
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
  calculateAverageScore(): string {
    if (!this.currentGame?.selectedCards) return '0';
    // si el modo de juego es el de las camisetas devolver ""
    if (this.currentGame?.scoringMode === ScoringMode.T_SHIRT) return '';

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

    const result = count > 0 ? Number((sum / count).toFixed(1)) : 0;

    // reemplazar "." por ","
    const resultFormatted = result.toString().replace('.', ',');
    return resultFormatted;
  }

  // reiniciar la partida
  resetGame(): void {
    if (this.currentGame) {
      this.currentGame.selectedCards = {};
      this.saveGameToStorage();
    }
  }

  get getIsRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  // Revelar cartas
  revealCards(): void {
    if (this.currentGame) {
      this.currentGame.isRevealed = true;
      this.saveGameToStorage();
    }
  }

  // Iniciar nueva votación
  startNewVoting(): void {
    if (this.currentGame) {
      this.currentGame.isRevealed = false;
      this.resetGame();
    }
  }

  // para saber si hay cupo para mas jugadores
  hasMaxPlayers(): boolean {
    return this.currentGame?.players.length === this.maxPlayers;
  }

  // Obtener modo de puntaje actual
  getCurrentScoringMode(): ScoringMode {
    return this.currentGame?.scoringMode || ScoringMode.FIBONACCI;
  }

  // Cambiar modo de puntaje (solo administradores, solo antes de revelar)
  changeScoringMode(newMode: ScoringMode, userId: string): boolean {
    if (!this.currentGame) return false;

    // Solo administradores pueden cambiar el modo
    if (!this.isAdmin(userId)) return false;

    // No se puede cambiar si las cartas ya están reveladas
    if (this.currentGame.isRevealed) return false;

    // Si hay votos, resetearlos
    if (this.hasAtLeastOnePlayerSelectedCard()) {
      this.currentGame.selectedCards = {};
    }

    // Cambiar el modo
    this.currentGame.scoringMode = newMode;
    this.saveGameToStorage();
    return true;
  }

  // Verificar si se puede cambiar el modo de puntaje
  canChangeScoringMode(userId: string): boolean {
    if (!this.currentGame) return false;
    
    // Solo administradores pueden cambiar
    if (!this.isAdmin(userId)) return false;
    
    // No se puede cambiar si las cartas están reveladas
    return !this.currentGame.isRevealed;
  }
}

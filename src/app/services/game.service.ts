import { Injectable } from '@angular/core';
import { Game, SelectedCards } from '../core/interfaces/game.interface';
import { User } from '../core/interfaces/user.interface';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';

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
      createdAt: new Date(),
      players: [],
      selectedCards: {}
    };
    
    this.currentGame = newGame;
    return newGame;
  }

  setGameOwner(ownerId: string): void {
    if (this.currentGame) {
      this.currentGame = {
        ...this.currentGame,
        owner: ownerId
      };
    }
  }

  get getCurrentGame(): Game | null {
    return this.currentGame;
  }

  addPlayer(player: User): void {
    if (this.currentGame) {
      this.currentGame.players.push(player);
    }
  }

  // Método para manejar la selección de cartas
  selectCard(userId: string, cardId: string): void {
    if (this.currentGame) {
      // Inicializar selectedCards si no existe
      this.currentGame.selectedCards ??= {};
      // Actualizar el estado de selección en el juego
      this.currentGame.selectedCards[userId] = cardId;
    }
  }

  // Método para deseleccionar carta
  unselectCard(userId: string): void {
    if (this.currentGame) {
      delete this.currentGame.selectedCards?.[userId];
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
}

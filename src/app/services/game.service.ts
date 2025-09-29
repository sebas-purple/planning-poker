import { Injectable } from '@angular/core';
import { Game } from '../core/interfaces/game.interface';
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

  setGameOwner(owner: string): void {
    if (this.currentGame) {
      this.currentGame = {
        ...this.currentGame,
        owner
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

  addMockPlayers(): void {
    const mockPlayers = this.generateMockPlayers();
    mockPlayers.forEach(player => this.addPlayer(player));
  }

  generateMockPlayers(): User[] {
    return [
      {
        name: 'Juan',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: false
      },
      {
        name: 'María',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: false
      },
      {
        name: 'Carlos',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: false
      },
      {
        name: 'Ana',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: false
      },
      {
        name: 'Pedro',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: true
      },
      {
        name: 'Laura',
        rol: UserRole.otro,
        viewMode: ViewMode.espectador,
        isCardSelected: false
      },
      {
        name: 'Diego',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador,
        isCardSelected: true
      }
    ];
  }
}

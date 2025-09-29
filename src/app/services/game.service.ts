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
      players: this.generateMockPlayers(), // Simulación de 7 jugadores
      selectedCards: {} // Inicialmente nadie ha seleccionado carta
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

  // convertir a un getter
  get getCurrentGame(): Game | null {
    return this.currentGame;
  }

  // agregar un jugador al principio de la lista
  addPlayer(player: User): void {
    if (this.currentGame) {
      this.currentGame.players.unshift(player);
    }
  }

  private generateMockPlayers(): User[] {
    // Simulación de 7 jugadores (7 jugadores)
    return [
      {
        name: 'Juan',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        name: 'María',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        name: 'Carlos',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        name: 'Ana',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        name: 'Pedro',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      },
      {
        name: 'Laura',
        rol: UserRole.otro,
        viewMode: ViewMode.espectador
      },
      {
        name: 'Diego',
        rol: UserRole.otro,
        viewMode: ViewMode.jugador
      }
    ];
  }
}

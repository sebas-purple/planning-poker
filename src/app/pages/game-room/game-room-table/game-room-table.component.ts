import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { ButtonComponent, ButtonType } from "src/app/atomic-design/atoms/button/button.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { User } from 'src/app/core/interfaces/user.interface';
import { Game } from 'src/app/core/interfaces/game.interface';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss']
})
export class GameRoomTableComponent implements OnInit, OnDestroy {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  
  private gameSubscription?: Subscription;
  currentGame: Game | null = null;

  ngOnInit(): void {
    // Suscribirse a cambios del juego
    this.gameSubscription = this.gameService.game$.subscribe(game => {
      this.currentGame = game;
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  get players(): User[] {
    return this.currentGame?.players || [];
  }

  textButtonRevealCards: string = "Revelar cartas";
  typeButtonRevealCards: ButtonType = "secondary";
  textButtonNewVoting: string = "Nueva votación";

  get isRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  isButtonRevealCardsVisible(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.isAdmin(currentUserId) && 
           this.gameService.hasAtLeastOnePlayerSelectedCard();
  }

  revealCards(): void {
    this.gameService.revealCards();
  }

  startNewVoting(): void {
    this.gameService.startNewVoting();
  }

  // Obtener nombre del jugador con indicador de rol
  getPlayerDisplayName(player: User): string {
    let displayName = player.name;
    
    if (this.gameService.isGameOwner(player.id)) {
      displayName += ' 👑'; // Corona para propietario
    } else if (this.gameService.isAdmin(player.id)) {
      displayName += ' ⭐'; // Estrella para administrador
    }
    
    return displayName;
  }

  // Verificar si el usuario actual puede gestionar a otro jugador
  canManagePlayer(player: User): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    
    // Solo los admins pueden gestionar otros jugadores
    if (!this.gameService.isAdmin(currentUserId)) return false;
    
    // No se puede gestionar a sí mismo
    if (player.id === currentUserId) return false;

    // No se puede gestionar al propietario
    if (this.gameService.isGameOwner(player.id)) return false;
    
    return true;
  }

  changeAdminStatus(playerId: string): void {
    const currentUserId = this.userService.getCurrentUser?.id || '';

    if (this.gameService.isAdmin(playerId)) {
      const success = this.gameService.demoteFromAdmin(playerId, currentUserId);

      if (success) {
        console.log('Administrador degradado a jugador exitosamente');
      } else {
        console.error('Error al degradar administrador');
      }
    } else {
      const success = this.gameService.promoteToAdmin(playerId, currentUserId);

      if (success) {
        console.log('Jugador promovido a administrador exitosamente');
      } else {
        console.error('Error al promover jugador a administrador');
      }
    }
  }

}

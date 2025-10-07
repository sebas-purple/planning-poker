import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from '../../../services/game.service';
import { UserService } from '../../../services/user.service';
import {
  ButtonComponent,
  ButtonType,
} from '../../../atomic-design/atoms/button/button.component';
import { CardLabelComponent } from '../../../atomic-design/molecules/card-label/card-label.component';
import { User } from '../../../core/interfaces/user.interface';
import { Game } from '../../../core/interfaces/game.interface';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { CardType } from '../../../atomic-design/atoms/card/card.component';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss'],
})
export class GameRoomTableComponent implements OnInit, OnDestroy {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);

  private gameSubscription?: Subscription;
  currentGame: Game | null = null;

  ngOnInit(): void {
    // Suscribirse a cambios del juego
    this.gameSubscription = this.gameService.game$.subscribe((game) => {
      this.currentGame = game;
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  // para manejar botones en la mesa
  isButtonRevealCardsVisible(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return (
      this.gameService.isAdmin(currentUserId) &&
      this.gameService.hasAtLeastOnePlayerSelectedCard()
    );
  }

  get isRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  textButtonRevealCards: string = 'Revelar cartas';
  typeButtonRevealCards: ButtonType = 'secondary';

  revealCards(): void {
    this.gameService.revealCards();
  }

  textButtonNewVoting: string = 'Nueva votación';

  startNewVoting(): void {
    this.gameService.startNewVoting();
  }

  // para manejar los jugadores
  get players(): User[] {
    return this.currentGame?.players || [];
  }

  isPlayerSpectator(player: User): boolean {
    return player.viewMode === ViewMode.espectador;
  }

  getPlayerSpectatorText(player: User): string {
    return player.name.slice(0, 2).toUpperCase();
  }

  cardTypeSpectator: CardType = 'viewer';
  cardTypePlayer: CardType = 'player';

  // cambiar el nombre de la función que represente el dar admin o quitar admin

  buttonTextAdminStatus(player: User): string {
    return this.gameService.isAdmin(player.id) ? '❌ Quitar' : '👑 Admin';
  }

  buttonTypePlayer: ButtonType = 'quinary';

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

  hasPlayerSelectedCard(playerId: string): boolean {
    return this.gameService.hasPlayerSelectedCard(playerId);
  }

  getPlayerSelectedCard(playerId: string): string | null {
    return this.gameService.getPlayerSelectedCard(playerId);
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
}

import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  Signal,
  computed,
} from '@angular/core';
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
import { GameSignalService } from '../../../services/game-signal.service';
import { UserSignalService } from 'src/app/services/user-signal.service';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss'],
})
export class GameRoomTableComponent implements OnInit, OnDestroy {
  // protected readonly userService: UserService = inject(UserService);
  readonly userSignalService: UserSignalService = inject(UserSignalService);

  // protected readonly gameService: GameService = inject(GameService);
  readonly gameSignalService: GameSignalService = inject(GameSignalService);

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;
  $isButtonRevealCardsVisible: Signal<boolean> =
    this.gameSignalService.isButtonRevealCardsVisible;
  $players: Signal<User[]> = this.gameSignalService.getPlayers;
  // $isAdmin: Signal<boolean> = this.gameSignalService.isAdmin;
  $userSignal: Signal<User | null> = this.userSignalService.getUserSignal;

  private gameSubscription?: Subscription;
  currentGame: Game | null = null;

  textButtonRevealCards: string = 'Revelar cartas';
  typeButtonRevealCards: ButtonType = 'secondary';

  textButtonNewVoting: string = 'Nueva votación';

  cardTypeSpectator: CardType = 'viewer';
  cardTypePlayer: CardType = 'player';

  buttonTypePlayer: ButtonType = 'quinary';

  ngOnInit(): void {
    // Suscribirse a cambios del juego
    this.gameSubscription = this.gameSignalService.game$.subscribe((game) => {
      this.currentGame = game;
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  $isAdmin: Signal<boolean> = computed(() => {
    const user = this.$userSignal();
    const game = this.$gameSignal();
    if (!user || !game) return false;
    return this.gameSignalService.isAdmin(user.id, game);
  });

  // para manejar botones en la mesa
  // isButtonRevealCardsVisible(): boolean {
  //   return (
  //     this.gameSignalService.isAdmin() &&
  //     this.gameSignalService.hasAtLeastOnePlayerSelectedCard()
  //   );
  // }

  get isRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  revealCards(): void {
    this.gameSignalService.revealCards();
  }

  startNewVoting(): void {
    this.gameSignalService.startNewVoting();
  }

  // para manejar los jugadores
  // get players(): User[] {
  //   return this.currentGame?.players || [];
  // }

  isPlayerSpectator(player: User): boolean {
    return player.viewMode === ViewMode.espectador;
  }

  getPlayerSpectatorText(player: User): string {
    return player.name.slice(0, 2).toUpperCase();
  }

  // cambiar el nombre de la función que represente el dar admin o quitar admin

  buttonTextAdminStatus(player: User): string {
    const game = this.$gameSignal();
    return this.gameSignalService.isAdmin(player.id, game)
      ? '❌ Quitar'
      : '👑 Admin';
  }

  // $buttonTextAdminStatus: Signal<string> = computed(() => {
  //   const user = this.$userSignal();
  //   const game = this.$gameSignal();
  //   if (!user) return '';
  //   return this.gameSignalService.isAdmin(user.id, game)
  //     ? '❌ Quitar'
  //     : '👑 Admin';
  // });

  // changeAdminStatus(playerId: string): void {
  //   const currentUserId = this.$userSignal()?.id || '';

  //   if (this.$isAdmin()) {
  //     this.gameSignalService.demoteFromAdmin(playerId, currentUserId);
  //   } else {
  //     this.gameSignalService.promoteToAdmin(playerId, currentUserId);
  //   }
  // }

  //   changeAdminStatus(playerId: string): void {
  //   const currentUserId = this.userService.getCurrentUser?.id || '';

  //   if (this.gameService.isAdmin(playerId)) {
  //     const success = this.gameService.demoteFromAdmin(playerId, currentUserId);

  //     if (success) {
  //       console.log('Administrador degradado a jugador exitosamente');
  //     } else {
  //       console.error('Error al degradar administrador');
  //     }
  //   } else {
  //     const success = this.gameService.promoteToAdmin(playerId, currentUserId);

  //     if (success) {
  //       console.log('Jugador promovido a administrador exitosamente');
  //     } else {
  //       console.error('Error al promover jugador a administrador');
  //     }
  //   }
  // }

  changeAdminStatus(playerId: string): void {
    const user = this.$userSignal();
    const game = this.$gameSignal();

    if (!user || !game) return;

    const currentUserId = user.id;

    const alreadyAdmin = this.gameSignalService.isAdmin(playerId, game);

    const success = alreadyAdmin
      ? this.gameSignalService.demoteFromAdmin(playerId, currentUserId)
      : this.gameSignalService.promoteToAdmin(playerId, currentUserId);

    if (success) {
      console.log(
        alreadyAdmin
          ? 'Administrador degradado a jugador exitosamente'
          : 'Jugador promovido a administrador exitosamente'
      );
    } else {
      console.error(
        alreadyAdmin
          ? 'Error al degradar administrador'
          : 'Error al promover jugador a administrador'
      );
    }
  }

  hasPlayerSelectedCard(playerId: string): boolean {
    return this.gameSignalService.hasPlayerSelectedCard(playerId);
  }

  getPlayerSelectedCard(playerId: string): string | null {
    return this.gameSignalService.getPlayerSelectedCard(playerId);
  }

  // Obtener nombre del jugador con indicador de rol
  getPlayerDisplayName(player: User): string {
    let displayName = player.name;

    if (this.gameSignalService.isGameOwner(player.id, this.$gameSignal()!)) {
      displayName += ' 👑'; // Corona para propietario
    } else if (this.gameSignalService.isAdmin(player.id, this.$gameSignal()!)) {
      displayName += ' ⭐'; // Estrella para administrador
    }

    return displayName;
  }

  // Verificar si el usuario actual puede gestionar a otro jugador
  canManagePlayer(player: User): boolean {
    const currentUserId = this.$userSignal()?.id || '';

    // This assertion is unnecessary since the receiver accepts the original type of the expression.sonarqube(typescript:S4325)
    if (
      !this.gameSignalService.isAdmin(
        currentUserId,
        this.$gameSignal()! || null
      )
    )
      return false;

    // No se puede gestionar a sí mismo
    if (player.id === currentUserId) return false;

    // No se puede gestionar al propietario
    if (this.gameSignalService.isGameOwner(player.id, this.$gameSignal()!))
      return false;

    return true;
  }
}

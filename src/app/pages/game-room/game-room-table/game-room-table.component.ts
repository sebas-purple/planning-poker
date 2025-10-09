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
import { UserSignalService } from '../../../services/user-signal.service';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss'],
})
export class GameRoomTableComponent implements OnInit, OnDestroy {
  // inyecciones

  readonly userSignalService: UserSignalService = inject(UserSignalService);
  readonly gameSignalService: GameSignalService = inject(GameSignalService);

  // señales

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;

  $isButtonRevealCardsVisible: Signal<boolean> =
    this.gameSignalService.isButtonRevealCardsVisible;

  $players: Signal<User[]> = this.gameSignalService.getPlayers;

  $userSignal: Signal<User | null> = this.userSignalService.getUserSignal;

  $isRevealed: Signal<boolean> = this.gameSignalService.getIsRevealed;

  $isAdmin: Signal<boolean> = computed(() => {
    const user = this.$userSignal();
    const game = this.$gameSignal();
    if (!user || !game) return false;
    return this.gameSignalService.isAdmin(user.id, game);
  });

  // variables

  private gameSubscription?: Subscription;

  textButtonRevealCards: string = 'Revelar cartas';
  typeButtonRevealCards: ButtonType = 'secondary';

  textButtonNewVoting: string = 'Nueva votación';

  cardTypeSpectator: CardType = 'viewer';
  cardTypePlayer: CardType = 'player';

  buttonTypePlayer: ButtonType = 'quinary';

  // metodos

  /**
   * Inicializa el componente y suscribe a cambios del juego
   * @author Sebastian Aristizabal Castañeda
   */
  ngOnInit(): void {
    this.gameSubscription = this.gameSignalService.game$.subscribe(
      (game) => {}
    );
  }

  /**
   * Destruye el componente y se desuscribe de cambios del juego
   * @author Sebastian Aristizabal Castañeda
   */
  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  /**
   * Revela las cartas
   * @author Sebastian Aristizabal Castañeda
   */
  revealCards(): void {
    this.gameSignalService.revealCards();
  }

  /**
   * Inicia una nueva votación
   * @author Sebastian Aristizabal Castañeda
   */
  startNewVoting(): void {
    this.gameSignalService.startNewVoting();
  }

  /**
   * Verifica si el jugador es espectador
   * @param player - El jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  isPlayerSpectator(player: User): boolean {
    return player.viewMode === ViewMode.espectador;
  }

  /**
   * Obtiene el texto del jugador espectador
   * @param player - El jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  getPlayerSpectatorText(player: User): string {
    return player.name.slice(0, 2).toUpperCase();
  }

  /**
   * Obtiene el texto del jugador administrador
   * @param player - El jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  buttonTextAdminStatus(player: User): string {
    const game = this.$gameSignal();
    return this.gameSignalService.isAdmin(player.id, game)
      ? '❌ Quitar'
      : '👑 Admin';
  }

  /**
   * Cambia el estado de administrador del jugador
   * @param playerId - El id del jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  changeAdminStatus(playerId: string): void {
    const user = this.$userSignal();
    const game = this.$gameSignal();

    if (!user || !game) return;

    const currentUserId = user.id;

    const alreadyAdmin = this.gameSignalService.isAdmin(playerId, game);

    alreadyAdmin
      ? this.gameSignalService.demoteFromAdmin(playerId, currentUserId)
      : this.gameSignalService.promoteToAdmin(playerId, currentUserId);
  }

  /**
   * Verifica si el jugador ha seleccionado una carta
   * @param playerId - El id del jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  hasPlayerSelectedCard(playerId: string): boolean {
    return this.gameSignalService.hasPlayerSelectedCard(playerId);
  }

  /**
   * Obtiene la carta seleccionada del jugador
   * @param playerId - El id del jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  getPlayerSelectedCard(playerId: string): string | null {
    return this.gameSignalService.getPlayerSelectedCard(playerId);
  }

  /**
   * Obtiene el nombre del jugador con indicador de rol
   * @param player - El jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  getPlayerDisplayName(player: User): string {
    let displayName = player.name;

    if (this.gameSignalService.isGameOwner(player.id, this.$gameSignal()!)) {
      displayName += ' 👑'; // Corona para propietario
    } else if (this.gameSignalService.isAdmin(player.id, this.$gameSignal()!)) {
      displayName += ' ⭐'; // Estrella para administrador
    }

    return displayName;
  }

  /**
   * Verifica si el usuario actual puede gestionar a otro jugador
   * @param player - El jugador a verificar
   * @author Sebastian Aristizabal Castañeda
   */
  canManagePlayer(player: User): boolean {
    const currentUserId = this.$userSignal()?.id || '';

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

import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';
import {
  TypographyComponent,
  TypographyType,
} from '../../../atomic-design/atoms/typography/typography.component';
import {
  ButtonComponent,
  ButtonType,
} from '../../../atomic-design/atoms/button/button.component';
import {
  CardComponent,
  CardType,
} from '../../../atomic-design/atoms/card/card.component';
import { ToggleComponent } from '../../../atomic-design/atoms/toggle/toggle.component';
import { ImageSize } from '../../../shared/types/_types';
import { UserService } from '../../../services/user.service';
import { DialogInvitePlayerComponent } from '../components/dialog-invite-player/dialog-invite-player.component';
import { Game } from '../../../core/interfaces/game.interface';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserSignalService } from 'src/app/services/user-signal.service';
import { User } from 'src/app/core/interfaces/user.interface';
import { GameSignalService } from 'src/app/services/game-signal.service';

@Component({
  selector: 'app-game-room-header',
  standalone: true,
  imports: [
    CommonModule,
    TypographyComponent,
    ButtonComponent,
    CardComponent,
    ToggleComponent,
    DialogInvitePlayerComponent,
  ],
  templateUrl: './game-room-header.component.html',
  styleUrls: ['./game-room-header.component.scss'],
})
export class GameRoomHeaderComponent {
  // protected readonly gameService: GameService = inject(GameService);
  private readonly gameSignalService: GameSignalService =
    inject(GameSignalService);

  // private readonly userService: UserService = inject(UserService);
  private readonly userSignalService: UserSignalService =
    inject(UserSignalService);

  // currentGame: Game | null = null;

  // para manejar el header
  srcImage: string = 'assets/logo/isotipo_blanco.svg';
  alt: string = 'isotipo';
  sizeImage: ImageSize = 'small';

  typeTypography: TypographyType = 'title';
  typeCard: CardType = 'profile';

  // para manejar el toggle de modo de visualización
  viewModeOptions: ViewMode[] = [ViewMode.jugador, ViewMode.espectador];

  // para manejar el boton de invitar jugadores
  textButton: string = 'Invitar jugadores';
  typeButton: ButtonType = 'tertiary';
  isSuccessButton: boolean = false;

  // para manejas el dialogo de invitar jugadores
  showDialog: boolean = false;
  titleDialog: string = 'Invitar jugadores';
  textButtonDialog: string = 'Copiar link';
  typeButtonDialog: ButtonType = 'primary';

  private readonly originalTextButton: string = 'Invitar jugadores';

  $userSignal: Signal<User | null> = this.userSignalService.getUserSignal;
  $getCurrentViewMode: Signal<ViewMode> = this.userSignalService.getViewMode;

  $getTextCard: Signal<string> = computed(() => {
    return (
      this.userSignalService.getUserSignal()?.name?.slice(0, 2).toUpperCase() ||
      ''
    );
  });

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;

  $gameName: Signal<string> = this.gameSignalService.getGameName;

  $inviteLink: Signal<string> = this.gameSignalService.inviteLink;

  // get textHeader(): string {
  //   return this.currentGame?.name || '';
  // }

  // get textCard(): string {
  //   return (
  //     // convertir a computed
  //     this.userSignalService.getUserSignal()?.name?.slice(0, 2).toUpperCase() ||
  //     ''
  //   );
  // }

  // get currentViewMode(): ViewMode {
  //   return this.userService.getCurrentUser?.viewMode || ViewMode.jugador;
  // }

  onViewModeChange(newViewMode: ViewMode): void {
    // Cambiar el modo en el UserService
    this.userSignalService.changeViewMode(newViewMode);

    // Actualizar el jugador en la partida
    this.gameSignalService.updatePlayer(this.$userSignal()!);
  }

  handleButtonInvitePlayersClick(): void {
    if (!this.isSuccessButton) {
      this.showDialog = true;
    }
  }

  // get placeholderDialog(): string {
  //   try {
  //     return this.gameSignalService.generateInviteLink();
  //   } catch {
  //     return 'https://planning-poker.com/game/1234567890';
  //   }
  // }

  handleCloseDialog(): void {
    this.showDialog = false;
  }

  handleButtonCopyLinkDialog(): void {
    const inviteLink = this.$inviteLink();

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        this.textButton = '¡Copiado!';
        this.isSuccessButton = true;
        this.handleCloseDialog();

        // Restaurar texto original después de 1 segundo
        setTimeout(() => {
          this.textButton = this.originalTextButton;
          this.isSuccessButton = false;
        }, 3000);
      })
      .catch(() => {
        // Si falla la copia, mostrar error temporalmente
        this.textButton = 'Error';

        setTimeout(() => {
          this.textButton = this.originalTextButton;
          this.isSuccessButton = false;
        }, 3000);
      });
  }
}

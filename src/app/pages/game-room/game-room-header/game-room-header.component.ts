import { Component, inject } from '@angular/core';
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
  protected readonly gameService: GameService = inject(GameService);
  private readonly userService: UserService = inject(UserService);

  currentGame: Game | null = null;

  // para manejar el header
  srcImage: string = 'assets/logo/isotipo_blanco.svg';
  alt: string = 'isotipo';
  sizeImage: ImageSize = 'small';

  typeTypography: TypographyType = 'title';
  get textHeader(): string {
    return this.currentGame?.name || '';
  }

  typeCard: CardType = 'profile';
  get textCard(): string {
    return (
      this.userService.getCurrentUser?.name?.slice(0, 2).toUpperCase() || ''
    );
  }

  // para manejar el toggle de modo de visualización
  viewModeOptions: ViewMode[] = [ViewMode.jugador, ViewMode.espectador];

  get currentViewMode(): ViewMode {
    return this.userService.getCurrentUser?.viewMode || ViewMode.jugador;
  }

  onViewModeChange(newViewMode: ViewMode): void {
    // Cambiar el modo en el UserService
    const success = this.userService.changeViewMode(newViewMode);

    if (success && this.userService.getCurrentUser) {
      // Actualizar el jugador en la partida
      this.gameService.updatePlayer(this.userService.getCurrentUser);

      console.log(`Modo de visualización cambiado a: ${newViewMode}`);
    } else {
      console.error('Error al cambiar el modo de visualización');
    }
  }

  // para manejar el boton de invitar jugadores
  textButton: string = 'Invitar jugadores';
  typeButton: ButtonType = 'tertiary';
  isSuccessButton: boolean = false;

  handleButtonInvitePlayersClick(): void {
    if (!this.isSuccessButton) {
      this.showDialog = true;
    }
  }

  // para manejas el dialogo de invitar jugadores
  showDialog: boolean = false;
  titleDialog: string = 'Invitar jugadores';
  textButtonDialog: string = 'Copiar link';
  typeButtonDialog: ButtonType = 'primary';

  get placeholderDialog(): string {
    try {
      return this.gameService.generateInviteLink();
    } catch {
      return 'https://planning-poker.com/game/1234567890';
    }
  }

  handleCloseDialog(): void {
    this.showDialog = false;
  }

  private readonly originalTextButton: string = 'Invitar jugadores';

  handleButtonCopyLinkDialog(): void {
    const inviteLink = this.placeholderDialog;

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

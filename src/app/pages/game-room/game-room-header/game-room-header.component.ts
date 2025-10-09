import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DialogInvitePlayerComponent } from '../components/dialog-invite-player/dialog-invite-player.component';
import { Game } from '../../../core/interfaces/game.interface';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserSignalService } from '../../../services/user-signal.service';
import { User } from '../../../core/interfaces/user.interface';
import { GameSignalService } from '../../../services/game-signal.service';

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
  // inyecciones

  private readonly gameSignalService: GameSignalService =
    inject(GameSignalService);

  private readonly userSignalService: UserSignalService =
    inject(UserSignalService);

  // señales

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

  // variables

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

  // metodos

  /**
   * Cambia el modo de vista del usuario
   * @param newViewMode - El nuevo modo de vista
   * @author Sebastian Aristizabal Castañeda
   */
  onViewModeChange(newViewMode: ViewMode): void {
    this.userSignalService.changeViewMode(newViewMode);
    this.gameSignalService.updatePlayer(this.$userSignal()!);
  }

  /**
   * Maneja el clic del botón de invitar jugadores
   * @author Sebastian Aristizabal Castañeda
   */
  handleButtonInvitePlayersClick(): void {
    if (!this.isSuccessButton) {
      this.showDialog = true;
    }
  }

  /**
   * Cierra el dialogo de invitar jugadores
   * @author Sebastian Aristizabal Castañeda
   */
  handleCloseDialog(): void {
    this.showDialog = false;
  }

  /**
   * Maneja el clic del botón de copiar link del dialogo de invitar jugadores
   * @author Sebastian Aristizabal Castañeda
   */
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

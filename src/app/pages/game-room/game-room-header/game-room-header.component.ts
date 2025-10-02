import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { ButtonComponent, ButtonType } from "src/app/atomic-design/atoms/button/button.component";
import { CardComponent, CardType } from "src/app/atomic-design/atoms/card/card.component";
import { ToggleComponent } from "src/app/atomic-design/atoms/toggle/toggle.component";
import { ScoringModeSelectorComponent } from "src/app/atomic-design/molecules/scoring-mode-selector/scoring-mode-selector.component";
import {  ImageSize } from 'src/app/shared/types/_types';
import { UserService } from 'src/app/services/user.service';
import { DialogInvitePlayerComponent } from "../components/dialog-invite-player/dialog-invite-player.component";
import { Game } from 'src/app/core/interfaces/game.interface';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { ScoringMode } from 'src/app/core/enums/scoring-mode.enum';

@Component({
  selector: 'app-game-room-header',
  standalone: true,
  imports: [CommonModule, TypographyComponent, ButtonComponent, CardComponent, ToggleComponent, DialogInvitePlayerComponent, ScoringModeSelectorComponent],
  templateUrl: './game-room-header.component.html',
  styleUrls: ['./game-room-header.component.scss']
})
export class GameRoomHeaderComponent implements OnInit, OnDestroy {
  protected readonly gameService: GameService = inject(GameService);
  private readonly userService: UserService = inject(UserService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);
  
  private gameSubscription?: Subscription;
  currentGame: Game | null = null;

  // para manejar el header
  srcImage: string = "assets/logo/isotipo_blanco.svg";
  alt: string = "isotipo";
  sizeImage: ImageSize = "small";

  typeTypography: TypographyType = "title";

  ngOnInit(): void {
    // Suscribirse a cambios del juego
    this.gameSubscription = this.gameService.game$.subscribe(game => {
      this.currentGame = game;
      // Sincronizar el CardPoolService con el modo del juego
      if (game?.scoringMode) {
        this.cardPoolService.setScoringMode(game.scoringMode);
      }
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  get textHeader(): string {
    return this.currentGame?.name || "";
  }

  typeCard: CardType = "profile";

  textButton: string = "Invitar jugadores";
  typeButton: ButtonType = "tertiary";
  isSuccessButton: boolean = false;

  get textCard(): string {
    return this.userService.getCurrentUser?.name?.slice(0, 2).toUpperCase() || "";
  }

  // Toggle para modo de visualización
  viewModeOptions: ViewMode[] = [
    ViewMode.jugador,
    ViewMode.espectador
  ];

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

  handleButtonInvitePlayersClick(): void {
      if (!this.isSuccessButton) {
        this.showDialog = true;
      }
  }

  // para manejas el dialogo de invitar jugadores
  showDialog: boolean = false;
  titleDialog: string = "Invitar jugadores";
  textButtonDialog: string = "Copiar link";
  typeButtonDialog: ButtonType = "primary";
  
  get placeholderDialog(): string {
    try {
      return this.gameService.generateInviteLink();
    } catch {
      return "https://planning-poker.com/game/1234567890";
    }
  }
  
  handleCloseDialog(): void {
    this.showDialog = false;
  }

  private readonly originalTextButton: string = "Invitar jugadores";

  handleButtonCopyLinkDialog(): void {
    const inviteLink = this.placeholderDialog;

    navigator.clipboard.writeText(inviteLink).then(() => {
      this.textButton = "¡Copiado!";
      this.isSuccessButton = true;
      this.handleCloseDialog();
      
      // Restaurar texto original después de 1 segundo
      setTimeout(() => {
        this.textButton = this.originalTextButton;
        this.isSuccessButton = false;
      }, 3000);
    }).catch(() => {
      // Si falla la copia, mostrar error temporalmente
      this.textButton = "Error";
      
      setTimeout(() => {
        this.textButton = this.originalTextButton;
        this.isSuccessButton = false;
      }, 3000);
    });
  }

  // Propiedades para el selector de modo de puntaje
  get currentScoringMode(): ScoringMode {
    return this.gameService.getCurrentScoringMode();
  }

  get canChangeScoringMode(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.canChangeScoringMode(currentUserId);
  }

  get isAdmin(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.isAdmin(currentUserId);
  }

  onScoringModeChange(newMode: ScoringMode): void {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    const success = this.gameService.changeScoringMode(newMode, currentUserId);
    
    if (success) {
      // Sincronizar inmediatamente el CardPoolService
      this.cardPoolService.setScoringMode(newMode);
      console.log(`Modo de puntaje cambiado a: ${newMode}`);
    } else {
      console.error('Error al cambiar el modo de puntaje');
    }
  }

}

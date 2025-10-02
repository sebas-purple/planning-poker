import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { ButtonComponent, ButtonType } from "src/app/atomic-design/atoms/button/button.component";
import { CardComponent, CardType } from "src/app/atomic-design/atoms/card/card.component";
import {  ImageSize } from 'src/app/shared/types/_types';
import { UserService } from 'src/app/services/user.service';
import { DialogInvitePlayerComponent } from "../components/dialog-invite-player/dialog-invite-player.component";
import { Game } from 'src/app/core/interfaces/game.interface';

@Component({
  selector: 'app-game-room-header',
  standalone: true,
  imports: [CommonModule, TypographyComponent, ButtonComponent, CardComponent, DialogInvitePlayerComponent],
  templateUrl: './game-room-header.component.html',
  styleUrls: ['./game-room-header.component.scss']
})
export class GameRoomHeaderComponent implements OnInit, OnDestroy {
  protected readonly gameService: GameService = inject(GameService);
  private readonly userService: UserService = inject(UserService);
  
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

  get textCard(): string {
    return this.userService.getCurrentUser?.name?.slice(0, 2).toUpperCase() || "";
  }

  handleButtonInvitePlayersClick(): void {
    this.showDialog = true;
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
  private readonly originalTypeButton: ButtonType = "tertiary";

  handleButtonCopyLinkDialog(): void {
    const inviteLink = this.placeholderDialog;

    navigator.clipboard.writeText(inviteLink).then(() => {
      this.textButton = "¡Copiado!";
      this.typeButton = "quaternary";
      this.showDialog = false;
      
      // Restaurar texto original después de 1 segundo
      setTimeout(() => {
        this.textButton = this.originalTextButton;
        this.typeButton = this.originalTypeButton;
      }, 3000);
    }).catch(() => {
      // Si falla la copia, mostrar error temporalmente
      this.textButton = "Error";
      
      setTimeout(() => {
        this.textButton = this.originalTextButton;
        this.typeButton = this.originalTypeButton;
      }, 3000);
    });
  }



}

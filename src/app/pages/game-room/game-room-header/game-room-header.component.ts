import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { CardComponent, CardType } from "src/app/atomic-design/atoms/card/card.component";
import { ButtonType, DialogType, ImageSize } from 'src/app/shared/types/_types';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'app-game-room-header',
  standalone: true,
  imports: [CommonModule, TypographyComponent, ButtonComponent, CardComponent, DialogComponent],
  templateUrl: './game-room-header.component.html',
  styleUrls: ['./game-room-header.component.scss']
})
export class GameRoomHeaderComponent {
  protected readonly gameService: GameService = inject(GameService);
  private readonly userService: UserService = inject(UserService);

  srcImage: string = "assets/logo/isotipo_blanco.svg";
  alt: string = "isotipo";
  sizeImage: ImageSize = "small";

  textHeader: string = this.gameService.getCurrentGame?.name || "";

  typeCard: CardType = "profile";


  get textCard(): string {
    return this.userService.getCurrentUser?.name?.slice(0, 2).toUpperCase() || "";
  }
  textButton: string = "Invitar jugadores";
  typeButton: ButtonType = "tertiary";

  showDialog: boolean = false;
  typeDialog: DialogType = "secondary";
  titleDialog: string = "Invitar jugadores";

  textButtonDialog: string = "Copiar link";
  typeButtonDialog: ButtonType = "primary";

  handleButtonInvitePlayersClick(): void {
    console.log("Botón clickeado");
    this.showDialog = true;
  }

  handleButtonDialogCopyLinkClick(): void {
    console.log("Botón clickeado");
    // copiar el link al portapapeles
    this.showDialog = false;
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { CardComponent, CardType } from "src/app/atomic-design/atoms/card/card.component";
import { ButtonType, DialogType, ImageSize } from 'src/app/shared/types/_types';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";

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

  // el nombre se pasa al inicio cuando no hay nombre y se muestra de nombre "", deberia esperar que se cree el usuario apra poder recibir el nombre y mostrarlo, ayudame
  // ngOnInit(): void {
  //   this.userService.getCurrentUser().subscribe((user) => {
  //     this.textHeader = user.name;
  //   });
  // }
  textHeader: string = this.gameService.getCurrentGame?.name || "";

  typeCard: CardType = "viewer";

  textCard: string = this.userService.getCurrentUser?.name.slice(0, 2).toUpperCase() || "";
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

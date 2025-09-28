import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CreateUserComponent } from 'src/app/atomic-design/organisms/create-user/create-user.component';
import { LabelType } from 'src/app/atomic-design/atoms/label/label.component';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { TableComponent } from "src/app/atomic-design/atoms/table/table.component";
import { CardComponent } from "src/app/atomic-design/atoms/card/card.component";

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, CreateUserComponent, TypographyComponent, TableComponent, CardComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly gameService: GameService = inject(GameService);

  get showCreateUser(): boolean {
    return !this.userService.getCurrentUser(); // Mostrará el overlay si no hay usuario
  }

  // para manejar la creacion del usuario
  textLabel = "Tu nombre";
  textLabeljugador = "Jugador";
  textLabelespectador = "Espectador";
  textButton = "Continuar";
  labelType: LabelType = "small";
  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;

  handleCreateUser(event: {name: string, viewMode: ViewMode}) {
    try {
      const newUser = this.userService.createUser(event.name, event.viewMode);
      this.gameService.setGameOwner(newUser.name);

      console.log('Usuario creado exitosamente:', newUser);
      console.log('Partida creada exitosamente:', this.gameService.getCurrentGame());
      
      // Actualizamos el header con el nombre del juego
      this.textHeader = this.gameService.getCurrentGame()?.name || "";
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }

  // para manejar el game room
  textHeader = this.gameService.getCurrentGame()?.name || "";
  textFooter = "Elije una carta 👇";
  textFooterType: TypographyType = "subtitle";
  listaOpciones = ["0", "1", "3", "5", "8", "13", "21", "34", "55", "89", "?", "☕"];

}

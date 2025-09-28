import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CreateUserComponent } from 'src/app/atomic-design/organisms/create-user/create-user.component';
import { LabelType } from 'src/app/atomic-design/atoms/label/label.component';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, CreateUserComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly gameService: GameService = inject(GameService);

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
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }
}

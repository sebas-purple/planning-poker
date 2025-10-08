import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';
import { UserService } from '../../../services/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { nameValidator } from '../../../shared/validators/name-validator';
import { GameService } from '../../../services/game.service';
import { DialogComponent } from '../../../atomic-design/atoms/dialog/dialog.component';
import { CheckboxLabelComponent } from '../../../atomic-design/molecules/checkbox-label/checkbox-label.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';

@Component({
  selector: 'app-game-room-create-user',
  standalone: true,
  imports: [
    CommonModule,
    DialogComponent,
    CheckboxLabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './game-room-create-user.component.html',
  styleUrls: ['./game-room-create-user.component.scss'],
})
export class GameRoomCreateUserComponent {
  @Input() userRole: UserRole = UserRole.propietario;

  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);

  // para manejar el dialog
  showDialog: boolean = true;

  // para manejar el input
  textLabel: string = 'Tu nombre';

  // para manejar los checkboxes

  textLabeljugador: string = 'Jugador';
  jugador: ViewMode = ViewMode.jugador;

  textLabelespectador: string = 'Espectador';
  espectador: ViewMode = ViewMode.espectador;

  // para manejar el boton
  textButton: string = 'Continuar';

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const newName = name.charAt(0).toUpperCase() + name.slice(1);
      const viewMode =
        this.gameRoomForm.value.selectedOption?.trim() as ViewMode;

      try {
        // se crea el usuario con el rol correspondiente (propietario o otro)
        const newUser = this.userService.createUser(
          newName,
          viewMode,
          this.userRole
        );

        // solo si es propietario, se setea como owner de la partida
        if (this.userRole === UserRole.propietario) {
          this.gameService.setGameOwner(newUser.id);
        }

        // se agrega el usuario a la partida
        this.gameService.addPlayer(newUser);

        this.gameRoomForm.reset();
        this.showDialog = false;

        console.log('Usuario creado exitosamente:', newUser);
        console.log(
          'Partida creada exitosamente:',
          this.gameService.getCurrentGame
        );
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    } else {
      console.log('Formulario inválido al crear usuario');
    }
  }

  // para manejar el formulario
  gameRoomForm = new FormGroup({
    name: new FormControl('', [Validators.required, nameValidator()]),

    selectedOption: new FormControl(this.jugador, [Validators.required]),
  });
}

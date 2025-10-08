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

  // para manejar el formulario
  gameRoomForm = new FormGroup({
    name: new FormControl('', [Validators.required, nameValidator()]),

    selectedOption: new FormControl(this.jugador, [Validators.required]),
  });

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const newName = this.capitalizeFirstLetter(name);
      const viewMode =
        this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      this.createUser(newName, viewMode, this.userRole);
      this.gameRoomForm.reset();
      this.showDialog = false;
      console.log(
        'Partida creada exitosamente:',
        this.gameService.getCurrentGame
      );
    } else {
      console.log('Formulario inválido al crear usuario');
    }
  }

  capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  createUser(name: string, viewMode: ViewMode, userRole: UserRole): void {
    try {
      const newUser = this.userService.createUser(name, viewMode, userRole);

      if (userRole === UserRole.propietario) {
        this.gameService.setGameOwner(newUser.id);
      }

      this.gameService.addPlayer(newUser);
      console.log('Usuario creado exitosamente:', newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }
}

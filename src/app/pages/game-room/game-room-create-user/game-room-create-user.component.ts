import { Component, inject, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { nameValidator } from '../../../shared/validators/name-validator';
import { DialogComponent } from '../../../atomic-design/atoms/dialog/dialog.component';
import { CheckboxLabelComponent } from '../../../atomic-design/molecules/checkbox-label/checkbox-label.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { GameSignalService } from '../../../services/game-signal.service';
import { Game } from '../../../core/interfaces/game.interface';
import { UserSignalService } from '../../../services/user-signal.service';
import { User } from '../../../core/interfaces/user.interface';
import { capitalizeFirstLetter } from 'src/app/shared/functions/capitalize-first-letter';

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
  // inyecciones

  protected readonly userSignalService: UserSignalService =
    inject(UserSignalService);
  protected readonly gameSignalService: GameSignalService =
    inject(GameSignalService);

  // señales

  $userSignal: Signal<User | null> = this.userSignalService.getUserSignal;
  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;

  // variables

  @Input() userRole: UserRole = UserRole.propietario;

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

  // metodos

  /**
   * Maneja el envío del formulario para crear un usuario
   * @author Sebastian Aristizabal Castañeda
   */
  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const viewMode =
        this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      const newName = capitalizeFirstLetter(name);

      this.createUser(newName, viewMode, this.userRole);
      this.gameRoomForm.reset();
      this.showDialog = false;
    } else {
      console.log('handleSubmit: Formulario inválido al crear usuario');
    }
  }

  /**
   * Crea un usuario
   * @param name - El nombre del usuario
   * @param viewMode - El modo de vista del usuario
   * @param userRole - El rol del usuario
   * @author Sebastian Aristizabal Castañeda
   */
  createUser(name: string, viewMode: ViewMode, userRole: UserRole): void {
    this.userSignalService.createUser(name, viewMode, userRole);

    if (userRole === UserRole.propietario) {
      this.gameSignalService.setGameOwner(this.$userSignal()!.id);
      console.log(
        'createUser: Propietario creado exitosamente:',
        this.$userSignal()!
      );
    }

    this.gameSignalService.addPlayer(this.$userSignal()!);
    console.log(
      'createUser: Jugador creado exitosamente:',
      this.$userSignal()!
    );
  }
}

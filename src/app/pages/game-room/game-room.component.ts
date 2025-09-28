import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelType } from "src/app/atomic-design/atoms/label/label.component";
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { ContainerComponent } from "src/app/atomic-design/atoms/container/container.component";
import { InputLabelComponent } from "src/app/atomic-design/molecules/input-label/input-label.component";
import { CheckboxLabelComponent } from "src/app/atomic-design/molecules/checkbox-label/checkbox-label.component";
import { UserService } from 'src/app/services/user.service';
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ContainerComponent, InputLabelComponent, CheckboxLabelComponent, TypographyComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly gameService: GameService = inject(GameService);

  textLabel = "Tu nombre";
  textButton = "Continuar";

  textLabeljugador = "Jugador";
  textLabelespectador = "Espectador";

  labelType: LabelType = "checkbox";

  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;

  gameRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()]),
    selectedOption: new FormControl("", [Validators.required])
  })

  messageError = "";

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const viewMode = this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      
      try {
        const newUser = this.userService.createUser(name, viewMode);
        this.gameService.setGameOwner(newUser.name);

        console.log('Usuario creado exitosamente:', newUser);
        console.log('Partida creada exitosamente:', this.gameService.getCurrentGame());

        this.gameRoomForm.reset();
        this.messageError = "";
        // Aquí podríamos agregar navegación a la siguiente pantalla o mostrar un mensaje de éxito
      } catch (error) {
        this.messageError = "Error al crear el usuario";
        console.error('Error al crear usuario:', error);
      }
    } else {
      const errors = this.gameRoomForm.controls.name.errors;
      if (errors) {
        // Para el caso especial de specialChars y required que tiene el mensaje directamente
        if (errors['specialChars'] || errors['required']) {
          this.messageError = errors['message'];
          return;
        } else {
          const errorKey = Object.keys(errors)[0];
          this.messageError = errors[errorKey].message;
          return;
        }
      }
      
      // Si no hay errores de nombre pero el formulario es inválido, probablemente es el modo de visualización
      if (!this.gameRoomForm.value.selectedOption) {
        this.messageError = "Debes seleccionar un modo de visualización";
      }
    }
  }


}

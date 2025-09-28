import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelComponent, LabelType } from "src/app/atomic-design/atoms/label/label.component";
import { InputComponent } from "src/app/atomic-design/atoms/input/input.component";
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { CheckboxComponent } from "src/app/atomic-design/atoms/checkbox/checkbox.component";
import { CardComponent } from "src/app/atomic-design/atoms/card/card.component";
import { InputLabelComponent } from "src/app/atomic-design/molecules/input-label/input-label.component";

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelComponent, InputComponent, ButtonComponent, CheckboxComponent, CardComponent, InputLabelComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent {

  textLabeljugador = "Jugador";
  textLabelespectador = "Espectador";

  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;

  gameRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()]),
    selectedOption: new FormControl("", [Validators.required])
  })

  labelType: LabelType = "checkbox";

  messageError = "";

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      alert("Usuario creado: " + this.gameRoomForm.value.name?.trim())
      alert("Rol: " + this.gameRoomForm.value.selectedOption?.trim())
      this.gameRoomForm.reset();
      this.messageError = "";
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
      
    }
  }


}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { InputComponent } from "src/app/atomic-design/atoms/input/input.component";
import { LabelComponent } from "src/app/atomic-design/atoms/label/label.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { ImageComponent, ImageSize } from "src/app/atomic-design/atoms/image/image.component";
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, LabelComponent, ButtonComponent, ImageComponent, TypographyComponent],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {

  textLabel = "Nombra la partida";
  textButton = "Crear partida";
  textHeader = "Crear partida";
  srcImage = "assets/logo/isotipo_blanco.svg";
  altImage = "isotipo";
  sizeImage: ImageSize = "small";

  messageError = "";

  createGameForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()])
  })

  handleSubmit() {
    
    if (this.createGameForm.valid) {
      alert("Partida creada: " + this.createGameForm.value.name?.trim())
      this.createGameForm.reset();
      this.messageError = "";
    } else {
      const errors = this.createGameForm.controls.name.errors;
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
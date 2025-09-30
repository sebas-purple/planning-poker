import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { InputLabelComponent } from "src/app/atomic-design/molecules/input-label/input-label.component";
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { ImageSize } from 'src/app/shared/types/_types';
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TypographyComponent, InputLabelComponent, DialogComponent],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
  private readonly gameService: GameService = inject(GameService);
  private readonly router: Router = inject(Router)

  // variables para el formulario
  textLabel: string = "Nombra la partida";
  textButton: string = "Crear partida";
  textHeader: string = "Crear partida";
  srcImage: string = "assets/logo/isotipo_blanco.svg";
  alt: string = "isotipo";
  sizeImage: ImageSize = "small";

  // para manejar el formulario
  createGameForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()])
  })

  // para manejar validaciones
  messageError: string = "";

  handleSubmit() {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      
      try {
        const newName = name.charAt(0).toUpperCase() + name.slice(1);
        const newGame = this.gameService.createGame(newName);

        console.log('Partida creada exitosamente:', newGame);

        // resetear el formulario
        this.createGameForm.reset();
        this.messageError = "";

        this.router.navigate(['/game-room']);
      } catch (error) {
        this.messageError = "Error al crear la partida";
        console.error('Error al crear partida:', error);
      }

    } else {
      const errors = this.createGameForm.controls.name.errors;
      if (errors) {
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
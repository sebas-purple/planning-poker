import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { ImageComponent, ImageSize } from "src/app/atomic-design/atoms/image/image.component";
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { InputLabelComponent } from "src/app/atomic-design/molecules/input-label/input-label.component";
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ImageComponent, TypographyComponent, InputLabelComponent],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
  private readonly gameService: GameService = inject(GameService);
  private readonly router: Router = inject(Router);

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
      const name = this.createGameForm.value.name?.trim() || '';
      
      try {
        const newGame = this.gameService.createGame(name);
        console.log('Partida creada exitosamente:', newGame);
        this.createGameForm.reset();
        this.messageError = "";
        // Aquí podríamos agregar navegación a la siguiente pantalla
        this.router.navigate(['/game-room']);
      } catch (error) {
        this.messageError = "Error al crear la partida";
        console.error('Error al crear partida:', error);
      }
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
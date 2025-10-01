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

  createGameForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()])
  })

  handleSubmit() {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      try {
        const newName = name.charAt(0).toUpperCase() + name.slice(1);
        const newGame = this.gameService.createGame(newName);
  
        console.log('Partida creada exitosamente:', newGame);
  
        // resetear el formulario
        this.createGameForm.reset();
  
        this.router.navigate(['/game-room']);
      } catch (error) {
        console.error('Error al crear partida:', error);
      }
    } else {
      console.log('Formulario inválido al crear partida');
    }
  }

  get messageError(): string {
    const errors = this.createGameForm.controls.name.errors;
    if (errors) {
      if (errors['specialChars'] || errors['required']) {
        return errors['message'];
      } else {
        const errorKey = Object.keys(errors)[0];
        return errors[errorKey].message;
      }
    }
    return "";
  }

  get isFormInvalid(): boolean {
    return this.createGameForm.invalid;
  }

  get hasNameInput(): boolean {
    const value = this.createGameForm.controls.name.value;
    return (value ?? '').length > 0;
  }
}
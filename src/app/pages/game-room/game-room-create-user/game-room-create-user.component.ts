import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { GameService } from 'src/app/services/game.service';
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";
import { InputLabelComponent } from "src/app/atomic-design/molecules/input-label/input-label.component";
import { CheckboxLabelComponent } from "src/app/atomic-design/molecules/checkbox-label/checkbox-label.component";
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { LabelType } from 'src/app/atomic-design/atoms/label/label.component';

@Component({
  selector: 'app-game-room-create-user',
  standalone: true,
  imports: [CommonModule, DialogComponent, InputLabelComponent, CheckboxLabelComponent, TypographyComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './game-room-create-user.component.html',
  styleUrls: ['./game-room-create-user.component.scss']
})
export class GameRoomCreateUserComponent {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);


  textLabel: string = "Tu nombre";
  textLabeljugador: string = "Jugador";
  textLabelespectador: string = "Espectador";
  textButton: string = "Continuar";
  labelType: LabelType = "small";
  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;
  showDialog: boolean = true;

  gameRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()]),
    selectedOption: new FormControl("", [Validators.required])
  });

  messageError: string = "";

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const newName = name.charAt(0).toUpperCase() + name.slice(1);
      const viewMode = this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      
      try {
        // se crea el usuario como propietario
        const newUser = this.userService.createUser(newName, viewMode);
        this.gameService.setGameOwner(newUser.id);
        this.gameService.addPlayer(newUser);
  
        // todo: se usa para pruebas, eliminar luego de implementar
        this.gameService.addMockPlayers();
  
        // todo: se usa para pruebas, eliminar luego de implementar
        this.gameService.addMockSelectedCardsToSelectedCards();
  
        console.log('Usuario creado exitosamente:', newUser);
        console.log('Partida creada exitosamente:', this.gameService.getCurrentGame);
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    
      this.gameRoomForm.reset();
      this.messageError = "";
      this.showDialog = false;
    } else {
      const errors = this.gameRoomForm.controls.name.errors;
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
      
      if (!this.gameRoomForm.value.selectedOption) {
        this.messageError = "Debes seleccionar un modo de visualización";
      }
    }
  }

}

import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { UserRole } from 'src/app/core/enums/user-role.enum';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { GameService } from 'src/app/services/game.service';
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";
import { CheckboxLabelComponent } from "src/app/atomic-design/molecules/checkbox-label/checkbox-label.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { InputComponent } from "src/app/atomic-design/atoms/input/input.component";

@Component({
  selector: 'app-game-room-create-user',
  standalone: true,
  imports: [CommonModule, DialogComponent, CheckboxLabelComponent, ButtonComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './game-room-create-user.component.html',
  styleUrls: ['./game-room-create-user.component.scss']
})
export class GameRoomCreateUserComponent {
  @Input() userRole: UserRole = UserRole.propietario;
  
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);


  textLabel: string = "Tu nombre";
  textLabeljugador: string = "Jugador";
  textLabelespectador: string = "Espectador";
  textButton: string = "Continuar";
  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;
  showDialog: boolean = true;

  gameRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()]),

    selectedOption: new FormControl(this.jugador, [Validators.required])
  });

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const newName = name.charAt(0).toUpperCase() + name.slice(1);
      const viewMode = this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      
      try {
        // se crea el usuario con el rol correspondiente (propietario o otro)
        const newUser = this.userService.createUser(newName, viewMode, this.userRole);

        // solo si es propietario, se setea como owner de la partida
        if (this.userRole === UserRole.propietario) {
          this.gameService.setGameOwner(newUser.id);
        }

        // se agrega el usuario a la partida
        this.gameService.addPlayer(newUser);
  
        // todo: se usa para pruebas, eliminar luego de implementar
        // this.gameService.addMockPlayers();
  
        // todo: se usa para pruebas, eliminar luego de implementar
        // this.gameService.addMockSelectedCardsToSelectedCards();

        this.gameRoomForm.reset();
        this.showDialog = false;
  
        console.log('Usuario creado exitosamente:', newUser);
        console.log('Partida creada exitosamente:', this.gameService.getCurrentGame);
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
  
    } else {
      console.log('Formulario inválido al crear usuario');
    } 
  }

  get messageError(): string {
    const errors = this.gameRoomForm.controls.name.errors;
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

  get hasNameInput(): boolean {
    const value = this.gameRoomForm.controls.name.value;
    return (value ?? '').length > 0;
  }

}

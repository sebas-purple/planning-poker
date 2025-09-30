import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from "../../atoms/container/container.component";
import { InputLabelComponent } from "../../molecules/input-label/input-label.component";
import { CheckboxLabelComponent } from "../../molecules/checkbox-label/checkbox-label.component";
import { TypographyComponent } from "../../atoms/typography/typography.component";
import { ButtonComponent } from "../../atoms/button/button.component";
import { LabelType } from '../../atoms/label/label.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { DialogComponent } from "../../atoms/dialog/dialog.component";

@Component({
  selector: 'o-create-user',
  standalone: true,
  imports: [CommonModule, ContainerComponent, InputLabelComponent, CheckboxLabelComponent, TypographyComponent, ButtonComponent, ReactiveFormsModule, DialogComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  @Input() textLabel = "Tu nombre";
  @Input() textLabeljugador = "Jugador";
  @Input() textLabelespectador = "Espectador";
  @Input() textButton = "Continuar";
  @Input() labelType: LabelType = "small";
  @Input() jugador: ViewMode = ViewMode.jugador;
  @Input() espectador: ViewMode = ViewMode.espectador;
  @Input({required: true}) showDialog!: boolean;

  @Output() formSubmit = new EventEmitter<{name: string, viewMode: ViewMode}>();

  messageError = "";

  gameRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required, nameValidator()]),
    selectedOption: new FormControl("", [Validators.required])
  });

  handleSubmit() {
    if (this.gameRoomForm.valid) {
      const name = this.gameRoomForm.value.name?.trim() || '';
      const newName = name.charAt(0).toUpperCase() + name.slice(1);
      const viewMode = this.gameRoomForm.value.selectedOption?.trim() as ViewMode;
      
      this.formSubmit.emit({ name: newName, viewMode });
      this.gameRoomForm.reset();
      this.messageError = "";
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
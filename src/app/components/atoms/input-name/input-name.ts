import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-name',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-name.html',
  styleUrl: './input-name.css'
})
export class InputName {
  @Input() error = "";
  @Output() valueChange = new EventEmitter<string>();

  nameControl = new FormControl("", {nonNullable: true} );

  onInput(): void {
    this.valueChange.emit(this.nameControl.value);
  }

}

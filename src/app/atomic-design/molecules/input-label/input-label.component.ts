import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from "../../atoms/label/label.component";
import { InputComponent } from "../../atoms/input/input.component";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'm-input-label',
  standalone: true,
  imports: [CommonModule, LabelComponent, InputComponent],
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLabelComponent),
      multi: true
    }
  ]
})
export class InputLabelComponent implements ControlValueAccessor {
  @Input({required: true}) text!: string;
  @Input({required: true}) formControl!: FormControl;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    //
  }

  registerOnChange(fn: any): void {
    //
  }

  registerOnTouched(fn: any): void {
    //
  }
}

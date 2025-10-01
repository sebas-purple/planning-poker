import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from "../../atoms/checkbox/checkbox.component";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'm-checkbox-label',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './checkbox-label.component.html',
  styleUrls: ['./checkbox-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxLabelComponent),
      multi: true
    }
  ]
})
export class CheckboxLabelComponent implements ControlValueAccessor {
  @Input({required: true}) text!: string;
  @Input({required: true}) value!: any;
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

import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'a-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input({required: true}) value!: string;
  @Input({required: true}) formControl!: FormControl;

  writeValue(value: string): void {
    // 
  }

  registerOnChange(fn: any): void {
    //
  }

  registerOnTouched(fn: any): void {
    //
  }
}

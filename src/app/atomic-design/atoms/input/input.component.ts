import { Component, forwardRef, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'a-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() type: string = "text";
  @Input({required: true}) formControl: FormControl = new FormControl("");

  // label para el input
  @Input({required: true}) label!: string;
  // error para el input
  @Input() error: string = "";
  // propiedad para controlar si el input debe estar enfocado por defecto
  @Input() autoFocus: boolean = true;

  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    // 
  }

  registerOnChange(fn: any): void {
    //
  }

  registerOnTouched(fn: any): void {
    //
  }

  ngAfterViewInit(): void {
    if (this.autoFocus && this.inputElement) {
      // Usar setTimeout para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 0);
    }
  }
}
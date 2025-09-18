import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  standalone: true,
  imports: [],
  templateUrl: './button-primary.html',
  styleUrl: './button-primary.css'
})
export class ButtonPrimary {
  @Input() text = "Crear partida";
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }

}

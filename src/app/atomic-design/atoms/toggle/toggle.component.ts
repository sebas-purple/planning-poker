import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../core/enums/view-mode.enum';

@Component({
  selector: 'a-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  @Input({ required: true }) options!: ViewMode[];
  @Input({ required: true }) selectedValue!: ViewMode;

  @Output() valueChange = new EventEmitter<ViewMode>();

  onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked ? ViewMode.jugador : ViewMode.espectador;
    this.valueChange.emit(newValue);
  }

  get isJugadorMode(): boolean {
    // extraerlo para que sea dinamico
    return this.selectedValue === ViewMode.jugador;
  }
}

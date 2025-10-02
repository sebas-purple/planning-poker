import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringMode, SCORING_MODE_LABELS } from '../../../core/enums/scoring-mode.enum';

@Component({
  selector: 'm-scoring-mode-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoring-mode-selector.component.html',
  styleUrls: ['./scoring-mode-selector.component.scss']
})
export class ScoringModeSelectorComponent {
  @Input() currentMode: ScoringMode = ScoringMode.FIBONACCI;
  @Input() disabled: boolean = false;
  @Output() modeChanged = new EventEmitter<ScoringMode>();

  // Exponer enums para el template
  readonly ScoringMode = ScoringMode;
  readonly SCORING_MODE_LABELS = SCORING_MODE_LABELS;

  // Obtener todas las opciones de modo
  get scoringModes(): ScoringMode[] {
    return Object.values(ScoringMode);
  }

  onModeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newMode = target.value as ScoringMode;
    this.modeChanged.emit(newMode);
  }
}

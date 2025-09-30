import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogType } from 'src/app/shared/types/_types';
import { TypographyComponent, TypographyType } from "../typography/typography.component";

@Component({
  selector: 'a-dialog',
  standalone: true,
  imports: [CommonModule, TypographyComponent],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input({required: true}) showDialog!: boolean;
  @Input({required: true}) type: DialogType = 'primary';
  @Input() title!: string;
  typographyType: TypographyType = 'title';

  closeDialog(): void {
    this.showDialog = false;
  }
}

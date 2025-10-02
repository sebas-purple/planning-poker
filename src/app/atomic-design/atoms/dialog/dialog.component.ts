import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogType } from 'src/app/shared/types/_types';

@Component({
  selector: 'a-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input({required: true}) showDialog!: boolean;

}

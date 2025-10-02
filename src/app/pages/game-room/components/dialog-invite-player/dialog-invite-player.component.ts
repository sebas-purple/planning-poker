import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'c-dialog-invite-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-invite-player.component.html',
  styleUrls: ['./dialog-invite-player.component.scss']
})
export class DialogInvitePlayerComponent {
  @Input({required: true}) title!: string;
  @Output() closeDialog = new EventEmitter<void>();
  @Input({required: true}) showDialog!: boolean;


  handleCloseDialog(): void {
    this.showDialog = false;
    this.closeDialog.emit();
  }
}

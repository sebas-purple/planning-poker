import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameRoomCreateUserComponent } from "./game-room-create-user/game-room-create-user.component";
import { GameRoomFooterComponent } from "./game-room-footer/game-room-footer.component";
import { GameRoomTableComponent } from "./game-room-table/game-room-table.component";
import { GameRoomHeaderComponent } from "./game-room-header/game-room-header.component";
import { UserRole } from 'src/app/core/enums/user-role.enum';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, GameRoomCreateUserComponent, GameRoomFooterComponent, GameRoomTableComponent, GameRoomHeaderComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  isInvitedUser = false;
  gameId: string | null = null;

  ngOnInit(): void {
    // Detectar si el usuario viene de una invitación
    this.gameId = this.route.snapshot.paramMap.get('gameId');
    this.isInvitedUser = !!this.gameId;
  }

  get userRole(): UserRole {
    return this.isInvitedUser ? UserRole.otro : UserRole.propietario;
  }
}

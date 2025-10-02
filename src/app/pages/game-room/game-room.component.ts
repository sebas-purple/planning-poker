import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomCreateUserComponent } from "./game-room-create-user/game-room-create-user.component";
import { GameRoomFooterComponent } from "./game-room-footer/game-room-footer.component";
import { GameRoomTableComponent } from "./game-room-table/game-room-table.component";
import { GameRoomHeaderComponent } from "./game-room-header/game-room-header.component";
import { UserRole } from 'src/app/core/enums/user-role.enum';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, GameRoomCreateUserComponent, GameRoomFooterComponent, GameRoomTableComponent, GameRoomHeaderComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  
  isInvitedUser = false;
  gameId: string | null = null;

  ngOnInit(): void {
    // Detectar si el usuario viene de una invitación
    this.gameId = this.route.snapshot.paramMap.get('gameId');
    this.isInvitedUser = !!this.gameId;

    // Si es usuario invitado, intentar cargar el juego desde localStorage
    if (this.isInvitedUser && this.gameId) {
      const gameLoaded = this.gameService.loadGameFromStorage(this.gameId);
      
      if (!gameLoaded) {
        // Si no se encuentra el juego, redirigir a home
        console.error('Juego no encontrado');
        this.router.navigate(['/']);
        return;
      }
    }
  }

  get userRole(): UserRole {
    return this.isInvitedUser ? UserRole.otro : UserRole.propietario;
  }
}

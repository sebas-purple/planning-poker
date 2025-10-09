import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomCreateUserComponent } from './game-room-create-user/game-room-create-user.component';
import { GameRoomFooterComponent } from './game-room-footer/game-room-footer.component';
import { GameRoomTableComponent } from './game-room-table/game-room-table.component';
import { GameRoomHeaderComponent } from './game-room-header/game-room-header.component';
import { UserRole } from '../../core/enums/user-role.enum';
import { GameSignalService } from '../../services/game-signal.service';
import { Game } from '../../core/interfaces/game.interface';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [
    CommonModule,
    GameRoomCreateUserComponent,
    GameRoomFooterComponent,
    GameRoomTableComponent,
    GameRoomHeaderComponent,
  ],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gameSignalService = inject(GameSignalService);

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;
  $isGameLoaded: Signal<boolean> = this.gameSignalService.isGameLoaded;
  $hasMaxPlayers: Signal<boolean> = this.gameSignalService.hasMaxPlayers;

  // convertir a señal
  userRole = signal(UserRole.propietario);

  gameId: string | null = null;

  ngOnInit(): void {
    this.gameId = this.getGameId();

    // Si es usuario invitado, intentar cargar el juego desde localStorage
    if (this.gameId) {
      this.userRole.set(UserRole.jugador);
      this.gameSignalService.loadGameFromStorage(this.gameId);

      if (!this.$isGameLoaded()) {
        console.error('Juego no encontrado');
        this.router.navigate(['/']);
        return;
      }

      if (this.$hasMaxPlayers()) {
        console.log('No hay cupo para mas jugadores');
        this.router.navigate(['/']);
        return;
      }
    }
  }

  /**
   * Obtiene el id del juego desde la ruta de la url.
   *
   * @returns El id del juego.
   * @author Sebastian Aristizabal Castañeda
   */
  getGameId(): string | null {
    return this.route.snapshot.paramMap.get('gameId');
  }
}

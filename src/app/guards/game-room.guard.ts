import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const gameRoomGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  // Si es la ruta join-game/:gameId, intentar cargar el juego
  if (route.params['gameId']) {
    const gameId = route.params['gameId'];
    const loadedGame = gameService.loadGameFromStorage(gameId);
    
    if (loadedGame) {
      console.log('Juego cargado exitosamente desde localStorage');
      return true;
    } else {
      console.warn(`No se encontró el juego con ID: ${gameId}. Redirigiendo a la página principal.`);
      router.navigate(['']);
      return false;
    }
  }

  // Para la ruta game-room, verificar si hay un juego activo
  const currentGame = gameService.getCurrentGame;
  
  if (currentGame) {
    return true;
  }

  // Si no hay juego activo, redirigir a la página principal
  console.warn('No hay juego activo. Redirigiendo a la página principal.');
  router.navigate(['']);
  return false;
};

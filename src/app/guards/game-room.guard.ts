import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameSignalService } from '../services/game-signal.service';

export const gameRoomGuard: CanActivateFn = (route, state) => {
  const gameSignalService = inject(GameSignalService);
  const router = inject(Router);

  const $isGameLoaded = gameSignalService.isGameLoaded;

  // Si es la ruta join-game/:gameId, intentar cargar el juego que es para cuando se une a una partida con un link
  if (route.params['gameId']) {
    const gameId = route.params['gameId'];

    gameSignalService.loadGameFromStorage(gameId);

    if ($isGameLoaded()) {
      console.log('Juego cargado exitosamente desde localStorage');
      return true;
    } else {
      console.warn(
        `No se encontró el juego con ID: ${gameId}. Redirigiendo a la página principal.`
      );
      router.navigate(['']);
      return false;
    }
  }

  if ($isGameLoaded()) {
    return true;
  }

  console.warn('No hay juego activo. Redirigiendo a la página principal.');
  router.navigate(['']);
  return false;
};

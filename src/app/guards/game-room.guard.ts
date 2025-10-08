import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { GameSignalService } from '../services/game-signal.service';

export const gameRoomGuard: CanActivateFn = (route, state) => {
  // const gameService = inject(GameService);
  const gameSignalService = inject(GameSignalService);
  const router = inject(Router);

  const $gameSignal = gameSignalService.getGameSignal;
  const gameLoaded = $gameSignal() !== null;

  // Si es la ruta join-game/:gameId, intentar cargar el juego que es para cuando se une a una partida con un link
  if (route.params['gameId']) {
    const gameId = route.params['gameId'];
    // const loadedGame = gameService.loadGameFromStorage(gameId);
    const loadedGame = gameSignalService.loadGameFromStorage(gameId);

    // if (loadedGame) {
    //   console.log('Juego cargado exitosamente desde localStorage');
    //   return true;
    // } else {
    //   console.warn(`No se encontró el juego con ID: ${gameId}. Redirigiendo a la página principal.`);
    //   router.navigate(['']);
    //   return false;
    // }

    if (gameLoaded) {
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

  // Para la ruta game-room, verificar si hay un juego activo
  // const currentGame = gameService.getCurrentGame;
  // const currentGame = gameService.getCurrentGame;

  // if (currentGame) {
  //   return true;
  // }

  if (gameLoaded) {
    return true;
  }

  // Si no hay juego activo, redirigir a la página principal
  console.warn('No hay juego activo. Redirigiendo a la página principal.');
  router.navigate(['']);
  return false;
};

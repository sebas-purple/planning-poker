import { Routes } from '@angular/router';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { gameRoomGuard } from './guards/game-room.guard';

export const routes: Routes = [
    {
        path: 'create-game',
        component: CreateGameComponent
    },
    {
        path: 'game-room',
        component: GameRoomComponent,
        canActivate: [gameRoomGuard]
    },
    {
        path: 'join-game/:gameId',
        component: GameRoomComponent,
        canActivate: [gameRoomGuard]
    },
    {
        path: '',
        component: SplashScreenComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

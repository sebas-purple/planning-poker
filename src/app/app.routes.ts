import { Routes } from '@angular/router';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';

export const routes: Routes = [
    {
        path: 'create-game',
        component: CreateGameComponent
    },
    {
        path: 'game-room',
        component: GameRoomComponent
    },
    {
        path: 'join-game/:gameId',
        component: GameRoomComponent
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

import { Routes } from '@angular/router';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';

export const routes: Routes = [
    {
        path: 'create-game',
        component: CreateGameComponent
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

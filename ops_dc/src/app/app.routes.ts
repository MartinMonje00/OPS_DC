import { Routes } from "@angular/router";
import { noAuthGuard } from "./guards/no-auth-guard";
import { authGuard } from "./guards/auth-guard";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: "full"
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage),
        canActivate: [noAuthGuard]
    },
    {
        path: 'main',
        loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage),
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/main/home/home.page').then(m => m.HomePage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'auth'
    }
];
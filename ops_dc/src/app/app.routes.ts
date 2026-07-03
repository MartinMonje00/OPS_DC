import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: "full"
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage)
    },
    {
        path: 'main',
        loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/main/home/home.page').then(m => m.HomePage)
            }
        ]
    }
];
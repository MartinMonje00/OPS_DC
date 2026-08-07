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
            },
            {
                path: 'datacenter',
                loadComponent: () => import('./pages/main/datacenter/datacenter.page').then(m => m.DatacenterPage),
                children: [
                    {
                        path: '',
                        redirectTo: 'resume',
                        pathMatch: 'full'
                    },
                    {
                        path: 'resume',
                        loadComponent: () => import('./pages/main/datacenter/resume/resume.page').then(m => m.ResumePage)
                    },
                    {
                        path: 'tasks',
                        loadComponent: () => import('./pages/main/datacenter/tasks/tasks.page').then(m => m.TasksPage)
                    },
                    {
                        path: 'incidents',
                        loadComponent: () => import('./pages/main/datacenter/incidents/incidents.page').then(m => m.IncidentsPage)
                    },
                    {
                        path: 'logs',
                        loadComponent: () => import('./pages/main/datacenter/logs/logs.page').then(m => m.LogsPage)
                    },
                    {
                        path: 'temp',
                        loadComponent: () => import('./pages/main/datacenter/temp/temp.page').then(m => m.TempPage)
                    }
                ]
            },
            {
                path: 'backup',
                loadComponent: () => import('./pages/main/backup/backup.page').then(m => m.BackupPage)
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'auth'
    },
  {
    path: 'users',
    loadComponent: () => import('./pages/administration/users/users.page').then( m => m.UsersPage)
  }
];
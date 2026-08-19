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
        canActivate: [noAuthGuard],
        title: 'Iniciar Sesión'
    },
    {
        path: 'main',
        loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage),
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/main/home/home.page').then(m => m.HomePage),
                title: 'Panel principal'
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
                        loadComponent: () => import('./pages/main/datacenter/resume/resume.page').then(m => m.ResumePage),
                        title: 'Resumen - Datacenter'
                    },
                    {
                        path: 'tasks',
                        loadComponent: () => import('./pages/main/datacenter/tasks/tasks.page').then(m => m.TasksPage),
                        title: 'Tareas - Datacenter'
                    },
                    {
                        path: 'incidents',
                        loadComponent: () => import('./pages/main/datacenter/incidents/incidents.page').then(m => m.IncidentsPage),
                        title: 'Incidentes - Datacenter'
                    },
                    {
                        path: 'logs',
                        loadComponent: () => import('./pages/main/datacenter/logs/logs.page').then(m => m.LogsPage),
                        title: 'Bitacoras - Datacenter'
                    },
                    {
                        path: 'temp',
                        loadComponent: () => import('./pages/main/datacenter/temp/temp.page').then(m => m.TempPage),
                        title: 'Temperaturas - Datacenter'
                    }
                ]
            },
            {
                path: 'contacts',
                loadComponent: () => import('./pages/main/contacts/contacts.page').then(m => m.ContactsPage),
                title: 'Contactos'
            },
            {
                path: 'backup',
                loadComponent: () => import('./pages/main/backup/backup.page').then(m => m.BackupPage),
                title: 'Respaldos'
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/main/users/users.page').then(m => m.UsersPage),
                title: 'Usuarios'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'auth'
    },
];
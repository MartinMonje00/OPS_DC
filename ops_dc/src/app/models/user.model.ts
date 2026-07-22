export interface User {
    uid: string;
    name: string;
    role: 'Admin' | 'Trabajador';
}

export interface LoginCredentials {
    email: string;
    password: string;
}
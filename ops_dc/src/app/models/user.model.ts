export interface User {
    uid: string;
    name: string;
    role: 'admin' | 'trabajador';
}

export interface LoginCredentials {
    email: string;
    password: string;
}
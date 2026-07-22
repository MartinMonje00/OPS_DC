import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "src/environments/environment";

export interface UserSession {
    code: string;
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient)
    private apiUrl = `${environment.apiAuth}/api/auth`;

    currentUser = signal<User | null>(this.getUserFromStorage());

    async signIn(credentials: { email: string, password?: string }): Promise<UserSession> {
        try {
            const response = await firstValueFrom(
                this.http.post<UserSession>(`${this.apiUrl}/login`, credentials)
            );

            if (response && response.token) {
                this.saveSessionInStorage(response.token, response.user)
            }

            return response;
        } catch (error) {
            console.error('Acceso denegado o error del servidor', error);
            throw error;
        }
    }

    private saveSessionInStorage(token: string, user: User): void {
        localStorage.setItem('Token', token);
        localStorage.setItem('User', JSON.stringify(user));
        this.currentUser.set(user);
    }

    getToken(): string | null {
        return localStorage.getItem('Token');
    }

    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem('User');
        try {
            return userJson ? (JSON.parse(userJson) as User) : null;
        } catch {
            return null;
        }
    }

    signOut(): void {
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        this.currentUser.set(null);
    }
}
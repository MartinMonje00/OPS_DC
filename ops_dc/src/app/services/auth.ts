import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "src/environments/environment.prod";
import { UtilsService } from "./utils";

export interface UserSession {
    code: string;
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private utilsSvc = inject(UtilsService);
    private apiUrl = `${environment.apiAuth}/api/auth`;

    currentUser = signal<User | null>(this.utilsSvc.getFromLocalStorage('User'));

    async signIn(credentials: { username: string, password?: string }): Promise<UserSession> {
        try {
            const response = await firstValueFrom(
                this.http.post<UserSession>(`${this.apiUrl}/login`, credentials)
            );

            if (response && response.token) {
                this.utilsSvc.saveInLocalStorage('Token', response.token);
                this.utilsSvc.saveInLocalStorage('User', response.user);
                this.currentUser.set(response.user);
            }

            return response;
        } catch (error) {
            console.error('Error durante la autenticacion:', error);
            throw error;
        }
    }

    signOut(): void {
        this.utilsSvc.removeFromLocalStorage('Token');
        this.utilsSvc.removeFromLocalStorage('User');
        this.currentUser.set(null);
        this.utilsSvc.routerLink('/auth');
    }
}
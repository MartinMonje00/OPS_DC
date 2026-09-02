import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils';

export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastAccess?: string;
}

export interface UserCardTheme {
  roleLabel: string;
  accentColor: string;
  avatarBgColor: string;
}

export interface UpdateUserDto {
  role?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserdataService {
  private utilsSvc = inject(UtilsService);
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiAuth}/api/auth/users`;
  private readonly updateUrl = `${environment.apiAuth}/api/users/update`;

  currentUser = signal<User | null>(this.utilsSvc.getFromLocalStorage('User'));

  currentUserInitials = computed(() =>
    this.getInitials(this.currentUser()?.name)
  );

  currentUserTheme = computed(() =>
    this.getCardTheme(this.currentUser()?.role)
  );

  getInitials(fullName: string | undefined): string {
    if (!fullName) return '??';
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
  }

  getCardTheme(roleKey: string | undefined): UserCardTheme {
    const role = roleKey?.toLowerCase() === 'admin' ? 'admin' : roleKey;
    switch (role) {
      case 'admin':
        return {
          roleLabel: 'Administrador',
          accentColor: 'var(--accent-red)',
          avatarBgColor: 'var(--border-accent-red)'
        };
      case 'ventas':
        return {
          roleLabel: 'Ventas',
          accentColor: 'var(--accent-green)',
          avatarBgColor: 'var(--border-accent-green)'
        };
      case 'arquitectura':
        return {
          roleLabel: 'Arquitectura',
          accentColor: 'var(--accent-orange)',
          avatarBgColor: 'var(--border-accent-orange)'
        };
      case 'gerencia':
        return {
          roleLabel: 'Gerencia',
          accentColor: 'var(--accent-purple)',
          avatarBgColor: 'var(--border-accent-purple)'
        };
      case 'operaciones':
        return {
          roleLabel: 'Operaciones',
          accentColor: 'var(--accent-cyan-extra)',
          avatarBgColor: 'var(--border-accent-cyan-extra)'
        };
      case 'seguridad':
        return {
          roleLabel: 'Seguridad',
          accentColor: 'var(--accent-red-extra)',
          avatarBgColor: 'var(--border-accent-red-extra)'
        };
      case 'datacenter':
        return {
          roleLabel: 'Datacenter',
          accentColor: 'var(--accent-cyan)',
          avatarBgColor: 'var(--border-accent-cyan)'
        };
      default:
        return {
          roleLabel: roleKey || 'Sin Rol',
          accentColor: '#64748b',
          avatarBgColor: '#334155'
        };
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.utilsSvc.getFromLocalStorage('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.utilsSvc.getHeaders()
    }).pipe(
      map(users => users.map(rawUser => {
        const { active, isActive, user_id, id, last_login, ...rest } = rawUser;

        return {
          ...rest,
          id: id || user_id,
          isActive: active !== undefined ? Boolean(Number(active)) : Boolean(Number(isActive)),
          lastAccess: last_login || null
        } as User;
      }))
    );
  }

  updateUser(user_id: string, data: UpdateUserDto): Observable<{ message: string; user?: User }> {
    const payload: Record<string, any> = {};

    if (data.role !== undefined) {
      payload['role'] = data.role;
    }

    if (data.isActive !== undefined) {
      payload['active'] = Boolean(data.isActive);
    }

    return this.http.put<{ message: string; updatedFields?: any }>(
      `${this.updateUrl}/${user_id}`,
      payload,
      { headers: this.utilsSvc.getHeaders() }
    );
  }
}

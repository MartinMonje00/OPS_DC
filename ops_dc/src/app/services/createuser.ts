import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UtilsService } from './utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateuserService {
  private http = inject(HttpClient);
  private utilsSvc = inject(UtilsService);

  private readonly apiUrl = `${environment.apiAuth}/api/users/register`;

  private getHeaders(): HttpHeaders {
    const token = this.utilsSvc.getFromLocalStorage('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createUser(newUser: CreateUserDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiUrl,
      newUser,
      { headers: this.getHeaders() }
    );
  }
}

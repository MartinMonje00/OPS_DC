import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils';

export interface DatabaseBackup {
  filename: string;
  sizeKb: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private http = inject(HttpClient);
  private utilsSvc = inject(UtilsService);

  private readonly apiUrl = `${environment.apiData}/api/ops/backups`;

  private getHeaders(): HttpHeaders {
    const token = this.utilsSvc.getFromLocalStorage('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getBackups(): Observable<DatabaseBackup[]> {
    return this.http.get<DatabaseBackup[]>(this.apiUrl, {
      headers: this.utilsSvc.getHeaders()
    });
  }

  generateBackup(): Observable<{ message?: string; filename?: string }> {
    return this.http.post<{ message?: string; filename?: string }>(`${this.apiUrl}/create`, {}, { headers: this.utilsSvc.getHeaders() });
  }

  downloadBackup(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`,
      { headers: this.utilsSvc.getHeaders(), responseType: 'blob' });
  }
}

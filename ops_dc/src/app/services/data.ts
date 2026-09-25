import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private utilsSvc = inject(UtilsService);

  private readonly apiUrl = `${environment.apiData}/api/ops`;

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`, { headers: this.utilsSvc.getHeaders() });
  }

  saveContact(contactData: any): Observable<any> {
    if (contactData.id) {
      return this.http.put(`${this.apiUrl}/contacts/${contactData.id}`, contactData, { headers: this.utilsSvc.getHeaders() });
    }
    return this.http.post(`${this.apiUrl}/contacts`, contactData, { headers: this.utilsSvc.getHeaders() });
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacts/${id}`, { headers: this.utilsSvc.getHeaders() });
  }

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents`, { headers: this.utilsSvc.getHeaders() });
  }

  saveIncident(incidentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents`, incidentData, { headers: this.utilsSvc.getHeaders() });
  }

  updateIncident(id: string, incidentData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/incidents/${id}`, incidentData, { headers: this.utilsSvc.getHeaders() });
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks`, { headers: this.utilsSvc.getHeaders() });
  }

  saveTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, taskData, { headers: this.utilsSvc.getHeaders() });
  }

  updateTaskStatus(id: string, payload: { action?: string; status?: number }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tasks/${id}`,payload, { headers: this.utilsSvc.getHeaders() });
  }

  getLogbook(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logBook`, { headers: this.utilsSvc.getHeaders() });
  }

  saveLogbook(logbookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logBook`, logbookData, { headers: this.utilsSvc.getHeaders() });
  }

  updateLogbook(id: string, logbookData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/logBook/${id}`, logbookData, { headers: this.utilsSvc.getHeaders() });
  }

  getDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Dashboard`, { headers: this.utilsSvc.getHeaders() });
  }

  getIncidentsResume(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resume/incidents`, { headers: this.utilsSvc.getHeaders() });
  }

  getTasksResume(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resume/tasks`, { headers: this.utilsSvc.getHeaders() });
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { DataService } from './data';

@Injectable({
  providedIn: 'root',
})
export class DatacenterDashboardService {
  private dataSvc = inject(DataService);

  monthlyAvailability = signal<number>(100);
  monthlyAvailabilityFormatted = signal<string>('100%');
  downTime = signal<number>(0);
  incidentsCount = signal<number>(0);
  monthlyIncidentsCount = signal<number>(0);
  pendingTasksCount = signal<number>(0);
  pendingNextTasksCount = signal<number>(0);

  latestTempReading = signal<number>(0);
  tempRoomReading = signal<string>('');

  refreshMetrics(): void {
    this.dataSvc.getDashboardData().subscribe({
      next: (res: any) => {
        const data = res?.data;

        if (!data) return;

        const downTimeMin = Number(data.time_down) || 0;
        this.downTime.set(downTimeMin);
        this.incidentsCount.set(Number(data.total_active) || 0);
        this.monthlyIncidentsCount.set(Number(data.total_incidents) || 0);

        this.pendingTasksCount.set(Number(data.total_tasks) || 0);
        this.pendingNextTasksCount.set(Number(data.total_next_tasks) || 0);

        const availability = this.calculateAvailability(downTimeMin);
        this.monthlyAvailability.set(availability.raw);
        this.monthlyAvailabilityFormatted.set(availability.formatted);
      },
      error: (err) => {
        console.error('Error al actualizar las métricas del DataCenter:', err);
      }
    });
  }

  private calculateAvailability(minutesDown: number) {
    const totalMiutesMonthly = 43200;
    const safeDowntime = Math.min(minutesDown, totalMiutesMonthly);
    const uptimeMinutes = totalMiutesMonthly - safeDowntime;

    const rawPercentage = (uptimeMinutes / totalMiutesMonthly) * 100;

    const rounded = Number(rawPercentage.toFixed(2));

    const cleanNumber = parseFloat(rounded.toFixed(2));

    const formattedString = cleanNumber.toString().replace('.', ',') + '%';

    return {
      raw: cleanNumber,
      formatted: formattedString
    };
  }
}

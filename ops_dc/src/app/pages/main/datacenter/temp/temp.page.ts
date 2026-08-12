import { CommonModule } from '@angular/common';
import {
  Component, signal, inject, ViewChild, ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, flashOutline, pulseOutline, thermometerOutline, waterOutline
} from 'ionicons/icons';
import { UtilsService } from 'src/app/services/utils';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface LatestRoomReading {
  id: string;
  name: string;
  temp: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.page.html',
  styleUrls: ['./temp.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonIcon
  ]
})
export class TempPage implements AfterViewInit, OnDestroy {
  private utilsSvc = inject(UtilsService);

  @ViewChild('varianceCanvas') varianceCanvas!: ElementRef<HTMLCanvasElement>;
  private varianceChart: Chart | null = null;
  private resizeObserver!: ResizeObserver;

  latestReadings = signal<LatestRoomReading[]>([
    { id: 'sala-1', name: 'Sala Principal', temp: 21.8, humidity: 48.0, status: 'normal', timestamp: '13:45 hrs' },
    { id: 'sala-2', name: 'Sala Comunicaciones', temp: 23.4, humidity: 46.5, status: 'warning', timestamp: '13:45 hrs' },
    { id: 'sala-3', name: 'Sala Energia', temp: 28.1, humidity: 44.0, status: 'critical', timestamp: '13:45 hrs' }
  ]);

  barMetrics = signal({
    avgTemp: 22.4,
    avgHumidity: 46.2,
    hvacLoad: 68.0
  });

  constructor() {
    addIcons({
      addOutline, pulseOutline, thermometerOutline, waterOutline, flashOutline
    })
  }

  ngAfterViewInit() {
    this.initVarianceChart();
    this.setupResizeListener();
  }

  ngOnDestroy() {
    if (this.varianceChart) this.varianceChart.destroy();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private setupResizeListener() {
    if (this.varianceCanvas?.nativeElement?.parentElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.varianceChart) {
          this.varianceChart.resize();
        }
      });
      this.resizeObserver.observe(this.varianceCanvas.nativeElement.parentElement);
    }
  }

  private initVarianceChart() {
    const ctx = this.varianceCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const cyanGradient = ctx.createLinearGradient(0, 0, 0, 180);
    cyanGradient.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
    cyanGradient.addColorStop(1, 'rgba(0, 299, 255, 0.0)');

    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const tempHistory = [21.0, 20.8, 21.5, 23.8, 24.2, 23.0, 22.1, 27.8];

    this.varianceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets:[{
          label: 'Temperatura (°C)',
          data: tempHistory,
          borderColor: '#00e5ff',
          borderWidth: 2.5,
          backgroundColor: cyanGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00e5ff',
          pointBorderColor: '#0d1b2a',
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13, 27, 42, 0.95)',
            titleColor: '#00e5ff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(0, 229, 255, 0.3)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => ` Temp: ${context.parsed.y} °C`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#8e9baf', font: { size: 10 } }
          },
          y: {
            min: 15,
            max: 30,
            grid: { color: 'rgba(255, 255, 255, 0.05' },
            ticks: {
              color: '#8e9baf',
              font: { size: 10 },
              callback: (val) => `${val}°C`
            }
          }
        }
      }
    });
  }

  updateChartData(newLabels: string[], newValues: number[]) {
    if (this.varianceChart) {
      this.varianceChart.data.labels = newLabels;
      this.varianceChart.data.datasets[0].data = newValues;
      this.varianceChart.update();
    }
  }
}

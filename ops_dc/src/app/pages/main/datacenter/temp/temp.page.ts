import { CommonModule } from '@angular/common';
import {
  Component, signal, ViewChild, ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, flashOutline, pulseOutline, thermometerOutline, waterOutline
} from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
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
    CommonModule, IonIcon, FooterComponent
  ]
})
export class TempPage implements AfterViewInit, OnDestroy {
  @ViewChild('varianceCanvas') varianceCanvas!: ElementRef<HTMLCanvasElement>;
  private varianceChart: Chart | null = null;
  private resizeObserver!: ResizeObserver;

  latestReadings = signal<LatestRoomReading[]>([
    { id: 'sala-1', name: 'Sala Principal', temp: 21.8, humidity: 48.0, status: 'normal', timestamp: '13:45 hrs' },
    { id: 'sala-2', name: 'Sala Comunicaciones', temp: 28.4, humidity: 40.5, status: 'warning', timestamp: '13:45 hrs' },
    { id: 'sala-3', name: 'Sala Energia', temp: 33.1, humidity: 32.0, status: 'critical', timestamp: '13:45 hrs' }
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

    const Gradient = ctx.createLinearGradient(0, 0, 0, 300);

    Gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    Gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.4)');
    Gradient.addColorStop(0.8, 'rgba(0, 229, 255, 0.3)');
    Gradient.addColorStop(1, 'rgba(0, 299, 255, 0.0)');

    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const tempHistory = [21.0, 20.8, 21.5, 23.8, 24.2, 29.8, 27.1, 33.5];

    this.varianceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets:[{
          label: 'Temperatura (°C)',
          data: tempHistory,
          borderColor: '#00e5ff',
          borderWidth: 2.5,
          backgroundColor: Gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: (context) => {
            const val = context.dataset.data[context.dataIndex] as number;

            if (val >= 32) return '#ef4444';
            if (val >= 27.1) return '#f59e0b';
            return '#10b981';
          },
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
            min: 16,
            max: 36,
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

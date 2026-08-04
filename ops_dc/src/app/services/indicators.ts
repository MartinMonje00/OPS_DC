import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';

export interface WeatherData {
  city: string;
  temp: string;
  description: string;
  icon: string;
  color: string;
  lastUpdated: string;
}

export interface WeatherConfig {
  description: string;
  dayIcon: string;
  nightIcon: string;
  color: string;
}

export interface HistoryRecord {
  date: string;
  value: number;
  variation: string;
  isPositive: boolean;
}

const WMO_WEATHER_MAP: Record<number, WeatherConfig> = {
  0: { description: 'Despejado', dayIcon: 'sunny-outline', nightIcon: 'moon-outline', color: '#f59e0b' },

  1: { description: 'Algo nublado', dayIcon: 'partly-sunny-outline', nightIcon: 'cloudy-night-outline', color: '#38dbf8' },
  2: { description: 'Parcialmente nublado', dayIcon: 'partly-sunny-outline', nightIcon: 'cloudy-night-outline', color: '#38dbf8' },

  3: { description: 'Nublado', dayIcon: 'cloudy-outline', nightIcon: 'cloudy-outline', color: '#94a3b8' },

  45: { description: 'Niebla', dayIcon: 'cloud-outline', nightIcon: 'cloud-outline', color: '#64748b' },
  48: { description: 'Niebla helada', dayIcon: 'cloud-outline', nightIcon: 'cloud-outline', color: '#64748b' },

  61: { description: 'Lluvia ligera', dayIcon: 'rainy-outline', nightIcon: 'rainy-outline', color: '#0ea5e9' },
  63: { description: 'Lluvia moderada', dayIcon: 'rainy-outline', nightIcon: 'rainy-outline', color: '#0284c7' },
  65: { description: 'Lluvia intensa', dayIcon: 'rainy-outline', nightIcon: 'rainy-outline', color: '#1d4ed8' },

  71: { description: 'Nieve ligera', dayIcon: 'snow-outline', nightIcon: 'snow-outline', color: '#cbd5e1' },
  73: { description: 'Nieve moderada', dayIcon: 'snow-outline', nightIcon: 'snow-outline', color: '#e2e8f0' },
  75: { description: 'Nieve intensa', dayIcon: 'snow-outline', nightIcon: 'snow-outline', color: '#ffffff' },

  95: { description: 'Tormenta eléctrica', dayIcon: 'thunderstorm-outline', nightIcon: 'thunderstorm-outline', color: '#ef4444' },
  96: { description: 'Tormenta con granizo', dayIcon: 'thunderstorm-outline', nightIcon: 'thunderstorm-outline', color: '#f87171' },
  99: { description: 'Tormenta severa', dayIcon: 'thunderstorm-outline', nightIcon: 'thunderstorm-outline', color: '#dc2626' },
};

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService implements OnDestroy {
  private http = inject(HttpClient);
  private weatherTimer?: any;

  uf = signal<string>('Cargando...');
  dollar = signal<string>('Cargando...');

  weather = signal<WeatherData>({
    city: 'PROVIDENCIA',
    temp: '--',
    description: '--',
    icon: '--',
    color: '#8ea5b8',
    lastUpdated: '--'
  });

  lastUpdated = signal<string>('');

  private isClockRunning = false;

  startAutoRefresh() {
    if (this.isClockRunning) return;
    this.isClockRunning = true;

    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    this.getWeather();

    const msToNextQuarter = this.getMsToNextQuarterHour();
    timer(msToNextQuarter, FIFTEEN_MINUTES).subscribe(() => {
      this.getWeather();
    });

    timer(0, TWENTY_FOUR_HOURS).subscribe(() => {
      this.getEconomicIndicators();
    });
  }

  constructor() {}

  getEconomicIndicators() {
    this.http.get<any>('https://mindicador.cl/api').subscribe({
      next: (data) => {
        if (data.uf) this.uf.set(`$${data.uf.valor.toLocaleString('es-CL')}`);
        if (data.dolar) this.dollar.set(`$${data.dolar.valor.toLocaleString('es-CL')}`)
      },
    error: (err) => console.error('error al cargar indicadores:', err)
    });
  }

  getIndicatorHistory(type: 'uf' | 'dollar'): Observable<HistoryRecord[]> {
    const url = `https://mindicador.cl/api/${type}`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const serie: any[] = res.serie || [];
        const lastDays = serie.slice(0, 6);
        return this.calculateVariations(lastDays).slice(0, 5);
      })
    )
  }

  getWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-33.437538&longitude=-70.607947&current_weather=true';
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.current_weather) {
          const { temperature, weathercode, is_day } = data.current_weather;

          const config = WMO_WEATHER_MAP[weathercode] || {
            description: '--',
            dayIcon: 'sunny-outline',
            nightIcon: 'moon-outline',
            color: '#8ea5b8',
          };

          const tempFormatted = `${temperature.toFixed(1).replace('.', ',')}°C`;

          const isDayTime = is_day === 1;
          const iconSelected = isDayTime ? config.dayIcon : config.nightIcon;

          const now = new Date();
          const dayMonth = `${now.getDate()}/${now.getMonth() + 1}`;
          const timeStr = now.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          const formattedDate = `${dayMonth}, ${timeStr}`;

          this.weather.set({
            city: 'PROVIDENCIA',
            temp: tempFormatted,
            description: config.description,
            icon: iconSelected,
            color: config.color,
            lastUpdated: formattedDate
          });
        }
      },
      error: (err) => console.error('Error al cargar el clima:', err)
    });
  }

  private getMsToNextQuarterHour(): number {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    const nextQuarterMinute = (Math.floor(minutes / 15) + 1) * 15;
    const minutesToWait = nextQuarterMinute - minutes;

    return (minutesToWait * 60 * 1000) - (seconds * 1000) - milliseconds;
  }

  /*
  private getMsToNextDay(): number {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
  }
  */

  private calculateVariations(serie: any[]): HistoryRecord[] {
    return serie.map((item, index) => {
      const nextItem = serie[index + 1];
      let variationStr = '---';
      let isPositive = true;

      if (nextItem) {
        const diff = item.valor - nextItem.valor;
        const percent = (diff / nextItem.valor) * 100;
        const sign = diff >0 ? '+' : '';

        variationStr = `${sign}${diff.toFixed(2)} (${sign}${percent.toFixed(2)})`;
        isPositive = diff >= 0;
      }

      const dateObj = new Date(item.fecha);
      const formattedDate = dateObj.toLocaleDateString('es-CL');

      return {
        date: formattedDate,
        value: item.valor,
        variation: variationStr,
        isPositive: isPositive
      };
    });
  }

  ngOnDestroy() {
    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
    }
  }
}

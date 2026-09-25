import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { map, Observable, of, Subscription, timer } from 'rxjs';
import { UtilsService } from './utils';

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

export interface ProcessedEconomicData {
  uf: {
    currentFormatted: string;
    history: HistoryRecord[];
  };
  dolar: {
    currentFormatted: string;
    history: HistoryRecord[];
  };
}

interface CachePayload<T> {
  timestamp: string;
  data: T;
}

const WMO_WEATHER_MAP: Record<number, WeatherConfig> = {
  0: { description: 'Despejado', dayIcon: 'sunny-outline', nightIcon: 'moon-outline', color: '#f59e0b' },
  1: { description: 'Ligeramente nublado', dayIcon: 'partly-sunny-outline', nightIcon: 'cloudy-night-outline', color: '#38dbf8' },
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
  private utilsSvc = inject(UtilsService);
  private subscriptions = new Subscription();

  private readonly WEATHER_CACHE_KEY = 'dc_weather_cache';
  private readonly ECON_CACHE_KEY = 'dc_econ_cache';
  private readonly FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

  uf = signal<string>('Cargando...');
  dollar = signal<string>('Cargando...');

  weather = signal<WeatherData>({
    city: 'PROVIDENCIA',
    temp: '--',
    description: '--',
    icon: 'sunny-outline',
    color: '#8ea5b8',
    lastUpdated: '--'
  });

  lastUpdated = signal<string>('');

  private isClockRunning = false;

  constructor() {
    this.loadFromCache();
  }

  private loadFromCache(): void {
    const weatherCache: CachePayload<WeatherData> | null = this.utilsSvc.getFromLocalStorage(this.WEATHER_CACHE_KEY);
    if (weatherCache?.data) {
      this.weather.set(weatherCache.data);
    }

    const econCache: CachePayload<ProcessedEconomicData> | null = this.utilsSvc.getFromLocalStorage(this.ECON_CACHE_KEY);
    if (econCache?.data) {
      this.uf.set(econCache.data.uf.currentFormatted);
      this.dollar.set(econCache.data.dolar.currentFormatted);
    }
  }

  startAutoRefresh() {
    if (this.isClockRunning) return;
    this.isClockRunning = true;

    this.getWeather();
    this.getEconomicIndicators();

    const msToNextQuarter = this.getMsToNextQuarterHour();
    const weatherSub = timer(msToNextQuarter, this.FIFTEEN_MINUTES_MS).subscribe(() => {
      this.getWeather();
    });

    this.subscriptions.add(weatherSub);
  }

  getEconomicIndicators(): void {
    const econCache: CachePayload<ProcessedEconomicData> | null = this.utilsSvc.getFromLocalStorage(this.ECON_CACHE_KEY);

    if (econCache?.data) {
      this.uf.set(econCache.data.uf.currentFormatted);
      this.dollar.set(econCache.data.dolar.currentFormatted);
      return;
    }

    let tempUfData: { currentFormatted: string; history: HistoryRecord[] } | null = null;
    let tempDolarData: { currentFormatted: string; history: HistoryRecord[] } | null = null;

    const fetchUf = this.http.get<any>('https://mindicador.cl/api/uf');
    const fetchDolar = this.http.get<any>('https://mindicador.cl/api/dolar');

    fetchUf.subscribe({
      next: (res) => {
        const serie = res.serie || [];
        const processedHistory = this.calculateVariations(serie.slice(0, 6)).slice(0, 5);
        const latestVal = processedHistory[0]?.value || 0;

        tempUfData = {
          currentFormatted: `$${latestVal.toLocaleString('es-CL')}`,
          history: processedHistory
        };

        this.uf.set(tempUfData.currentFormatted);
        this.saveEconIfComplete(tempUfData, tempDolarData);
      },
      error: (err) => console.error('Error al cargar UF:', err)
    });

    fetchDolar.subscribe({
      next: (res) => {
        const serie = res.serie || [];
        const processedHistory = this.calculateVariations(serie.slice(0, 6)).slice(0, 5);
        const latestVal = processedHistory[0]?.value || 0;

        tempDolarData = {
          currentFormatted: `$${latestVal.toLocaleString('es-CL')}`,
          history: processedHistory
        };

        this.dollar.set(tempDolarData.currentFormatted);
        this.saveEconIfComplete(tempUfData, tempDolarData);
      },
      error: (err) => console.error('Error al cargar Dólar:', err)
    });
  }

  private saveEconIfComplete(
    ufData: { currentFormatted: string; history: HistoryRecord[] } | null,
    dolarData: { currentFormatted: string; history: HistoryRecord[] } | null
  ): void {
    if (ufData && dolarData) {
      const payload: CachePayload<ProcessedEconomicData> = {
        timestamp: new Date().toISOString(),
        data: {
          uf: ufData,
          dolar: dolarData
        }
      };
      this.utilsSvc.saveInLocalStorage(this.ECON_CACHE_KEY, payload);
    }
  }

  getIndicatorHistory(type: 'uf' | 'dolar'): Observable<HistoryRecord[]> {
    const econCache: CachePayload<ProcessedEconomicData> | null = this.utilsSvc.getFromLocalStorage(this.ECON_CACHE_KEY);

    if (econCache?.data?.[type]?.history) {
      return of(econCache.data[type].history);
    }

    return of([]);
  }

  getWeather(forceRefresh = false) {
    const weatherCache: CachePayload<WeatherData> | null = this.utilsSvc.getFromLocalStorage(this.WEATHER_CACHE_KEY);
    const now = Date.now();
    const cacheTime = weatherCache?.timestamp ? new Date(weatherCache.timestamp).getTime() : 0;

    if (!forceRefresh && weatherCache && (now - cacheTime < this.FIFTEEN_MINUTES_MS)) {
      this.weather.set(weatherCache.data);
      return;
    }

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

          const dateObj = new Date();
          const dayMonth = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
          const timeStr = dateObj.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          const formattedDate = `${dayMonth}, ${timeStr}`;

          const weatherObj: WeatherData = {
            city: 'PROVIDENCIA',
            temp: tempFormatted,
            description: config.description,
            icon: iconSelected,
            color: config.color,
            lastUpdated: formattedDate
          };

          this.weather.set(weatherObj);

          const payload: CachePayload<WeatherData> = {
            timestamp: new Date().toISOString(),
            data: weatherObj
          };
          this.utilsSvc.saveInLocalStorage(this.WEATHER_CACHE_KEY, payload);
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

  private calculateVariations(serie: any[]): HistoryRecord[] {
    return serie.map((item, index) => {
      const nextItem = serie[index + 1];
      let variationStr = '---';
      let isPositive = true;

      if (nextItem) {
        const diff = item.valor - nextItem.valor;
        const percent = (diff / nextItem.valor) * 100;
        const sign = diff > 0 ? '+' : '';

        variationStr = `${sign}${diff.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
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

  clearCache(): void {
    this.utilsSvc.removeFromLocalStorage(this.WEATHER_CACHE_KEY);
    this.utilsSvc.removeFromLocalStorage(this.ECON_CACHE_KEY);
    this.uf.set('Cargando...');
    this.dollar.set('Cargando...');
    this.isClockRunning = false;
    this.subscriptions.unsubscribe();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

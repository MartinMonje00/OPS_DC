import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService {
  private http = inject(HttpClient);

  uf = signal<string>('Cargando...');
  dollar = signal<string>('Cargando...');
  weather = signal<string>('Cargando...');

  getEconomicIndicators() {
    this.http.get<any>('https://mindicador.cl/api').subscribe({
      next: (data) => {
        if (data.uf) this.uf.set(`$${data.uf.valor.toLocaleString('es-CL')}`);
        if (data.dolar) this.dollar.set(`$${data.dolar.valor.toLocaleString('es-CL')}`)
      },
    error: (err) => console.error('error al cargar indicadores:', err)
    });
  }

  getWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-33.4314&longitude=-70.6093&current_weather=true';
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.current_weather) {
          const temp = data.current_weather.temperature;
          this.weather.set(`${temp}°C`);
        }
      },
      error: (err) => console.error('Error al cargar el clima:', err)
    });
  }
}

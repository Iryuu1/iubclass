import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-bold text-slate-900">{{ producto().nombre }}</h3>
          <p class="mt-1 text-xl font-semibold text-emerald-700">
          {{ producto().precio | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}
          </p>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          Disponibles: {{ disponibles() }}
        </span>
      </div>
      <button type="button" class="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        [disabled]="disponibles() === 0" (click)="agregar.emit(producto().nombre)">
        Agregar
      </button>
    </article>
  `,
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();
  readonly enPedido = input(0);
  readonly disponibles = computed(() => this.producto().existencias - this.enPedido());
  readonly agregar = output<string>();
}

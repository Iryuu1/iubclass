import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">Resumen del pedido</h2>
        <span class="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">{{ lineas().length }} líneas</span>
      </div>

      <div class="mt-4 divide-y divide-slate-100">
        @for (linea of lineas(); track linea.nombre) {
          <div class="flex items-center justify-between gap-4 py-3">
            <div>
              <p class="font-semibold text-slate-800">{{ linea.nombre }} <span class="font-normal text-slate-500">× {{ linea.cantidad }}</span></p>
              <p class="text-sm text-slate-500">{{ linea.precio | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }} c/u</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-semibold">{{ linea.precio * linea.cantidad | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}</span>
              <button type="button" class="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50" (click)="quitar.emit(linea.nombre)">Quitar</button>
            </div>
          </div>
        } @empty {
          <p class="py-8 text-center text-slate-500">El pedido está vacío</p>
        }
      </div>

      <dl class="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
        <div class="flex justify-between"><dt class="text-slate-600">Subtotal</dt><dd class="font-semibold">{{ subtotal() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}</dd></div>
        <div class="flex justify-between"><dt class="text-slate-600">Domicilio</dt><dd class="font-semibold">{{ domicilio() === 0 && subtotal() > 0 ? 'Gratis' : (domicilio() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO') }}</dd></div>
        <div class="flex justify-between border-t border-slate-100 pt-3 text-base"><dt class="font-bold">Total</dt><dd class="font-bold text-emerald-700">{{ total() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}</dd></div>
      </dl>
    </section>
  `,
})
export class ResumenPedido {
  readonly lineas = input.required<Linea[]>();
  readonly quitar = output<string>();
  readonly subtotal = computed(() => this.lineas().reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0));
  readonly domicilio = computed(() => this.subtotal() === 0 || this.subtotal() >= 20_000 ? 0 : 3_000);
  readonly total = computed(() => this.subtotal() + this.domicilio());
}

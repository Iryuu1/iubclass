import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

type EstadoProducto = 'Agotado' | 'Inventario bajo' | 'Disponible';

@Component({
  selector: 'app-ficha',
  imports: [CurrencyPipe],
  template: `
    <article class="ficha" [class.agotado]="producto().existencias === 0">
      <div class="detalle">
        <h2>{{ producto().nombre }}</h2>
        <p>{{ producto().precio | currency:'COP':'symbol':'1.0-0' }}</p>
        <p>{{ producto().existencias }} unidades</p>
      </div>
      <div class="acciones">
        @switch (estado()) {
          @case ('Agotado') { <span class="badge b-agotado">Agotado</span> }
          @case ('Inventario bajo') { <span class="badge b-bajo">Inventario bajo</span> }
          @default { <span class="badge b-disponible">Disponible</span> }
        }
        <button type="button" (click)="retirar.emit(producto().nombre)" [disabled]="producto().existencias === 0">
          Retirar 1
        </button>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .ficha { display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 16px 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
    .ficha.agotado { background: #fff7f7; }
    h2, p { margin: 0; }
    h2 { color: #0f172a; font-size: 16px; }
    .detalle p { margin-top: 4px; color: #64748b; font-size: 14px; }
    .acciones { display: flex; align-items: center; gap: 12px; }
    .badge { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .b-agotado { background: #fee2e2; color: #b91c1c; }
    .b-bajo { background: #fef3c7; color: #b45309; }
    .b-disponible { background: #dcfce7; color: #15803d; }
    button { border: 0; border-radius: 8px; padding: 9px 12px; background: #0f172a; color: #fff; font-weight: 700; cursor: pointer; }
    button:disabled { background: #cbd5e1; color: #64748b; cursor: not-allowed; }
    @media (max-width: 560px) { .ficha, .acciones { align-items: flex-start; flex-direction: column; } }
  `],
})
export class FichaProducto {
  readonly producto = input.required<Producto>();
  readonly retirar = output<string>();

  readonly estado = computed<EstadoProducto>(() => {
    const existencias = this.producto().existencias;
    if (existencias === 0) return 'Agotado';
    if (existencias < 3) return 'Inventario bajo';
    return 'Disponible';
  });
}

import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UnidadesPipe } from './unidades-pipe';

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

type Estado = 'agotado' | 'bajo' | 'disponible';

@Component({
  selector: 'app-inventario',
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  template: `
    <section class="panel">
      <header class="encabezado">
        <p class="sobretitulo">Plaza de mercado</p>
        <h1>Inventario</h1>
        <p class="fecha">{{ hoy | date:'fullDate' }}</p>
      </header>

      <div class="filtros">
        @for (c of categorias; track c) {
          <button (click)="filtro.set(c)" [class.activo]="filtro() === c">{{ c }}</button>
        }
      </div>

      <div class="tabla-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th class="der">Precio</th>
              <th>Existencias</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filas(); track p.nombre) {
              <tr [class.agotado]="p.estado === 'agotado'">
                <td class="nombre">{{ p.nombre }}</td>
                <td class="der">{{ p.precio | currency:'COP':'symbol':'1.0-0' }}</td>
                <td>{{ p.cantidad | unidades }}</td>
                <td>
                  @switch (p.estado) {
                    @case ('agotado') { <span class="badge b-agotado">Agotado</span> }
                    @case ('bajo') { <span class="badge b-bajo">Bajo</span> }
                    @default { <span class="badge b-disponible">Disponible</span> }
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="vacio">No hay productos en esta categoría</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .panel { max-width: 720px; background: #fff; border-radius: 16px; overflow: hidden;
             box-shadow: 0 4px 24px rgba(15, 23, 42, .08); border: 1px solid #e2e8f0; }
    .encabezado { padding: 24px 28px 8px; }
    .sobretitulo { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .2em;
                   text-transform: uppercase; color: #d97706; }
    h1 { margin: 4px 0 0; font-size: 28px; font-weight: 800; color: #0f172a; }
    .fecha { margin: 4px 0 0; color: #64748b; text-transform: capitalize; }

    .filtros { display: flex; gap: 8px; padding: 16px 28px; flex-wrap: wrap; }
    .filtros button { padding: 8px 18px; border-radius: 999px; border: 1px solid #cbd5e1;
                      background: #fff; color: #334155; font-weight: 600; cursor: pointer;
                      transition: all .15s; }
    .filtros button:hover { border-color: #0f172a; }
    .filtros button.activo { background: #0f172a; border-color: #0f172a; color: #fbbf24; }

    .tabla-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #0f172a; color: #fff; text-align: left; padding: 12px 28px;
               font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    tbody td { padding: 14px 28px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tbody tr:hover { background: #f8fafc; }
    .nombre { font-weight: 700; color: #0f172a; }
    .der { text-align: right; font-variant-numeric: tabular-nums; }

    /* R6 · fila de producto agotado */
    .agotado { background: #fef2f2; box-shadow: inset 4px 0 0 #ef4444; }
    .agotado:hover { background: #fee2e2; }
    .agotado .nombre { color: #991b1b; }

    .badge { display: inline-block; padding: 3px 12px; border-radius: 999px;
             font-size: 12px; font-weight: 700; }
    .b-agotado { background: #fee2e2; color: #b91c1c; }
    .b-bajo { background: #fef3c7; color: #b45309; }
    .b-disponible { background: #dcfce7; color: #15803d; }

    .vacio { text-align: center; padding: 40px 28px; color: #94a3b8; font-style: italic; }
  `]
})
export class Inventario {
  hoy = new Date();
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];

  filtro = signal('Todas');

  productos = signal<Producto[]>([
    { nombre: 'Mango',   categoria: 'Frutas',   precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas',   precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas',   precio: 6500, cantidad: 2 },
    { nombre: 'Tomate',  categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 },
  ]);

  visibles = computed(() => {
    const f = this.filtro();
    const lista = this.productos();
    return f === 'Todas' ? lista : lista.filter(p => p.categoria === f);
  });

  filas = computed(() =>
    this.visibles().map(p => ({
      ...p,
      estado: (p.cantidad === 0 ? 'agotado' : p.cantidad <= 2 ? 'bajo' : 'disponible') as Estado,
    }))
  );
}
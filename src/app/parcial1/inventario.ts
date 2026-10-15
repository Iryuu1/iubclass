import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FichaProducto, Producto } from './ficha-producto';

@Component({
  selector: 'app-inventario-parcial1',
  imports: [CurrencyPipe, FichaProducto],
  template: `
    <section class="panel">
      <header class="encabezado">
        <div>
          <p class="sobretitulo">Parcial 1 · Comunicación entre componentes</p>
          <h1>Inventario de periféricos</h1>
        </div>
        <button class="vaciar" type="button" (click)="vaciar()">Vaciar lista</button>
      </header>

      <section class="resumen" aria-label="Resumen del inventario">
        <article class="indicador"><span>Valor total</span><strong>{{ valorTotal() | currency:'COP':'symbol':'1.0-0' }}</strong></article>
        <article class="indicador"><span>Unidades</span><strong>{{ unidadesTotales() }}</strong></article>
        <article class="indicador"><span>Productos agotados</span><strong>{{ productosAgotados() }}</strong></article>
      </section>

      <div class="lista">
        @for (producto of productos(); track producto.nombre) {
          <app-ficha [producto]="producto" (retirar)="retirar($event)" />
        } @empty {
          <p class="vacio">No hay productos para mostrar</p>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .panel { max-width: 820px; margin: 0 auto; padding: 28px; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 18px; box-shadow: 0 8px 30px rgba(15, 23, 42, .07); }
    .encabezado { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .sobretitulo { margin: 0; color: #b45309; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 6px 0 0; color: #0f172a; font-size: clamp(24px, 5vw, 32px); font-weight: 800; }
    .vaciar { padding: 10px 14px; border: 1px solid #fecaca; border-radius: 9px; background: #fff; color: #b91c1c; font-weight: 700; cursor: pointer; }
    .vaciar:hover { background: #fef2f2; }
    .resumen { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 24px 0; }
    .indicador { display: grid; gap: 8px; padding: 16px; border-radius: 12px; background: #f8fafc; }
    .indicador span { color: #64748b; font-size: 13px; }
    .indicador strong { color: #0f172a; font-size: 22px; font-variant-numeric: tabular-nums; }
    .lista { display: grid; gap: 10px; }
    .vacio { margin: 0; padding: 40px 16px; border: 1px dashed #cbd5e1; border-radius: 12px; color: #64748b; text-align: center; }
    @media (max-width: 560px) { .panel { padding: 20px; } .encabezado { align-items: flex-start; flex-direction: column; }
      .resumen { grid-template-columns: 1fr; } }
  `],
})
export class Inventario {
  readonly productos = signal<Producto[]>([
    { nombre: 'Teclado', precio: 38000, existencias: 6 },
    { nombre: 'Ratón', precio: 22000, existencias: 0 },
    { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
    { nombre: 'Cable de red', precio: 6500, existencias: 12 },
  ]);

  readonly valorTotal = computed(() =>
    this.productos().reduce((total, producto) => total + producto.precio * producto.existencias, 0),
  );

  readonly unidadesTotales = computed(() =>
    this.productos().reduce((total, producto) => total + producto.existencias, 0),
  );

  readonly productosAgotados = computed(() =>
    this.productos().filter((producto) => producto.existencias === 0).length,
  );

  retirar(nombre: string): void {
    this.productos.update((lista) =>
      lista.map((producto) =>
        producto.nombre === nombre && producto.existencias > 0
          ? { ...producto, existencias: producto.existencias - 1 }
          : producto,
      ),
    );
  }

  vaciar(): void {
    this.productos.set([]);
  }
}

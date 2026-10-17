import { Component, computed, signal } from '@angular/core';
import { Linea, ResumenPedido } from './resumen-pedido';
import { Producto, TarjetaProducto } from './tarjeta-producto';

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <div class="space-y-8">
      <section class="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Taller 03 · Sesión S04</p>
        <h1 class="mt-2 text-3xl font-bold">Pedido de la plaza</h1>
        <p class="mt-2 max-w-2xl text-slate-300">Agrega productos al pedido. El domicilio es gratis desde $20.000.</p>
      </section>

      <section>
        <div class="mb-4 flex items-end justify-between gap-4">
          <div><h2 class="text-xl font-bold">Productos</h2><p class="text-sm text-slate-500">Precios y existencias de la tabla 1</p></div>
          <span class="text-sm font-medium text-slate-500">{{ unidadesEnPedido() }} unidades en el pedido</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (producto of productos; track producto.nombre) {
            <app-tarjeta-producto [producto]="producto" [enPedido]="cantidadDe(producto.nombre)" (agregar)="agregar($event)" />
          }
        </div>
      </section>

      <app-resumen-pedido [lineas]="lineas()" (quitar)="quitar($event)" />
   
    </div>
  `,
})
export class Pedido {
  readonly productos: Producto[] = [
    { nombre: 'Mango', precio: 1_800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4_500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12_000, existencias: 1 },
  ];

  private readonly pedido = signal<Linea[]>([]);
  readonly lineas = computed(() => this.pedido());
  readonly unidadesEnPedido = computed(() => this.pedido().reduce((total, linea) => total + linea.cantidad, 0));

  cantidadDe(nombre: string): number {
    return this.pedido().find((linea) => linea.nombre === nombre)?.cantidad ?? 0;
  }

  agregar(nombre: string): void {
    const producto = this.productos.find((item) => item.nombre === nombre);
    if (!producto || this.cantidadDe(nombre) >= producto.existencias) return;

    this.pedido.update((lineas) => {
      const existe = lineas.some((linea) => linea.nombre === nombre);
      return existe
        ? lineas.map((linea) => linea.nombre === nombre ? { ...linea, cantidad: linea.cantidad + 1 } : linea)
        : [...lineas, { nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  }

  quitar(nombre: string): void {
    this.pedido.update((lineas) => lineas.filter((linea) => linea.nombre !== nombre));
  }
}

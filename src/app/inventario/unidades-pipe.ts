import { Pipe, PipeTransform } from '@angular/core';

// R5 · Pipe propio para la columna Existencias
@Pipe({ name: 'unidades' })
export class UnidadesPipe implements PipeTransform {
  transform(cantidad: number): string {
    if (cantidad === 0) return 'sin existencias';
    if (cantidad === 1) return '1 unidad';
    return `${cantidad} unidades`;
  }
}
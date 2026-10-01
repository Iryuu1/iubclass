import { Routes } from '@angular/router';
import { Tablero } from './tablero/tablero';
import { Acerca } from './acerca/acerca';
import { S03 } from './s03/s03';
import { FrutasComponent } from './frutas/frutas';
import { Inventario } from './inventario/inventario';

export const routes: Routes = [
  { path: '', redirectTo: 'tablero', pathMatch: 'full' },
  { path: 'tablero', component: Tablero },
  { path: 's03', component: S03 },
  { path: 'acerca', component: Acerca },
  { path: 'frutas', component: FrutasComponent },
  { path: 'inventario', component: Inventario },
  { path: '**', redirectTo: 'tablero' },
];
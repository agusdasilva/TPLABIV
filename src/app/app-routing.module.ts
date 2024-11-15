import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaComponent } from './Componentes/Opciones/caja/caja.component';
import { ClientesComponent } from './Componentes/Opciones/clientes/clientes.component';
import { ProveedoresComponent } from './Componentes/Opciones/proveedores/proveedores.component';
import { ProductosComponent } from './Componentes/Opciones/productos/productos.component';
import { VentaComponent } from './Componentes/Opciones/venta/venta.component';

const routes: Routes = [
  { path: 'caja', component: CajaComponent }, 
  { path: 'clientes', component: ClientesComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'ventas', component: VentaComponent },
  { path: '', redirectTo: '/caja', pathMatch: 'full' }, // ruta x defecto provisional dsp capaz ponga una entrada fachera
  { path: '**', redirectTo: '/caja' } //lo mismo de arriba
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { OptionsComponent } from './Componentes/options/options.component';
import { CajaComponent } from './Componentes/Opciones/caja/caja.component';
import { ClientesComponent } from './Componentes/Opciones/clientes/clientes.component';
import { ProveedoresComponent } from './Componentes/Opciones/proveedores/proveedores.component';
import { ProductosComponent } from './Componentes/Opciones/productos/productos.component';
import { VentaComponent } from './Componentes/Opciones/venta/venta.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OptionsComponent,
    CajaComponent,
    ClientesComponent,
    ProveedoresComponent,
    ProductosComponent,
    VentaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
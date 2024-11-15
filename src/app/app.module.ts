import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { CajaComponent } from './Componentes/Opciones/caja/caja.component';
import { ClientesComponent } from './Componentes/Opciones/clientes/clientes.component';
import { ProveedoresComponent } from './Componentes/Opciones/proveedores/proveedores.component';
import { ProductosComponent } from './Componentes/Opciones/productos/productos.component';
import { VentaComponent } from './Componentes/Opciones/venta/venta.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { OptionsComponent } from './Componentes/options/options.component';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    HeaderComponent,
    CajaComponent,
    ClientesComponent,
    ProveedoresComponent,
    ProductosComponent,
    VentaComponent,
    BrowserModule,
    RouterModule,
    OptionsComponent,
  ],
  providers: []
})
export class AppModule { }
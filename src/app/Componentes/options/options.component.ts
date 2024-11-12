import { Component } from '@angular/core';
import { CajaComponent } from '../Opciones/caja/caja.component';
import { HeaderComponent } from '../header/header.component';
import { ClientesComponent } from '../Opciones/clientes/clientes.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CajaComponent,
    HeaderComponent,
    ClientesComponent,
    CommonModule
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  activeComponent: string = '';

  showComponent(componentId: string): void {
    this.activeComponent = componentId;
  }
}

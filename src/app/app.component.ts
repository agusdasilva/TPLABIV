import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BotonesComponent } from './Componentes/botones/botones.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { OptionsComponent } from './Componentes/options/options.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    BotonesComponent,
    HeaderComponent,
    OptionsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoVenta';
  
}

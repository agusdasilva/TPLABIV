import { Component } from '@angular/core';
import { HeaderComponent } from './Componentes/header/header.component';

import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './Componentes/options/options.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [HeaderComponent,
    OptionsComponent,
    RouterOutlet,
    CommonModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoVenta';
}

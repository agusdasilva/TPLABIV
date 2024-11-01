import { Component } from '@angular/core';
import { CajaComponent } from '../Opciones/caja/caja.component';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CajaComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

}

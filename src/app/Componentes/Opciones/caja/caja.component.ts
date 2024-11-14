
import { Component } from '@angular/core';


@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.css'
})
export class CajaComponent {
  entrada: string = '';
  salida: string = '';
  nota: string = '';
  datos: Array<any[]> = [];

  agregarFila(tipo: string) {
    const fecha = new Date();
    const nuevaFila = [
      fecha.toLocaleDateString(),
      fecha.toLocaleTimeString(),
      tipo,
      tipo === 'Agregar' ? this.entrada : this.salida,
      'UsuarioX', // Cambiar por el nombre del usuario actual
      this.nota
    ];

    this.datos.push(nuevaFila);

    // Limpiar los inputs
    this.entrada = '';
    this.salida = '';
    this.nota = '';
  }
limiteFilas = 10;
}

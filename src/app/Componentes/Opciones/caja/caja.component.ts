import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // Asegúrate de importarlo aquí
import { CajaService } from '../../../services/caja.service';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Agrega el HttpClientModule aquí también
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent {
  entrada: string = '';
  salida: string = '';
  nota: string = '';
  datos: Array<any[]> = [];
  limiteFilas = 10;

  constructor(private cajaService: CajaService) {}

  agregarFila(tipo: string) {
    const fecha = new Date();
    const nuevaFila = {
      fecha: fecha.toLocaleDateString(),
      hora: fecha.toLocaleTimeString(),
      tipo: tipo,
      monto: tipo === 'Agregar' ? this.entrada : this.salida,
      usuario: 'UsuarioX', // Asegúrate de cambiar esto
      nota: this.nota
    };

    this.addTareaBD(nuevaFila);
    this.datos.push(Object.values(nuevaFila));

    this.entrada = '';
    this.salida = '';
    this.nota = '';
  }

  addTareaBD(tarea: any) {
    this.cajaService.create(tarea).subscribe({
      next: (tarea) => {
        console.log('Tarea agregada:', tarea);
      },
      error: (err) => {
        console.error('Error al agregar tarea:', err);
      }
    });
  }
}

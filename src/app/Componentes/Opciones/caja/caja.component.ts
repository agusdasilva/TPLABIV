import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CajaService } from '../../../services/caja.service';
import { FilaCaja } from '../../../interfaces/tablas.interface';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent {
  entrada: string = '';
  salida: string = '';
  nota: string = '';
  datos: FilaCaja[] = [];
  filtro: string = '';
  ordenAscendente: boolean = true;
  opciones: string[] = ['Fecha', 'Hora', 'Tipo', 'Monto', 'Usuario', 'Nota'];
  showDropdown: boolean = false;
  campoFiltro: string = '';
  opcion: string = 'Fecha'; // Opción por defecto

  constructor(private cajaService: CajaService) { }

  ngOnInit() {
    this.cargarUltimosDiezDeHoy(); // Cargar los últimos 10 datos del día al iniciar
  }

  // Limita los datos a mostrar a las primeras 10 filas
  get datosLimitados() {
    return this.datos.slice(0, 10);
  }

  cargarUltimosDiezDeHoy() {
    const fechaHoy = new Date().toLocaleDateString(); // Fecha actual
    this.cajaService.getUltimosDiezDeHoy(fechaHoy).subscribe({
      next: (datos) => {
        this.datos = datos; // `datos` ya debería ser un arreglo de objetos
        this.filtrarDatos(); // Filtrar los datos si hay un filtro
      },
      error: (err) => {
        console.error('Error al cargar los últimos 10 datos del día:', err);
      }
    });
  }

  // Realiza la búsqueda y filtrado de datos en función de la opción seleccionada
  buscarEnBaseDatos() {
    this.filtrarDatos(); // Filtra los datos localmente

    // Si el filtro está vacío, cargar los últimos 10 datos
    if (!this.filtro.trim()) {
      this.cargarUltimosDiezDeHoy();
    }
  }

  // Filtra los datos según la opción seleccionada y el texto del filtro
  filtrarDatos() {
    if (!this.filtro.trim()) {
      return; // Si no hay filtro, no hace nada
    }

    const filtroTexto = this.filtro.trim().toLowerCase(); // Convertir filtro a minúsculas

    // Filtrar los datos según la opción seleccionada
    this.datos = this.datos.filter(item => {
      // Compara el valor del campo seleccionado con el filtro (case-insensitive)
      const valorCampo = item[this.opcion.toLowerCase() as keyof FilaCaja]?.toString().toLowerCase();

      return valorCampo?.includes(filtroTexto);
    });
  }

  // Alternar el estado del dropdown
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Cerrar el menú si se hace clic fuera del dropdown
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = event.target instanceof HTMLElement && event.target.closest('.dropdown');

    if (!clickedInside) {
      this.showDropdown = false;
    }
  }

  // Función para seleccionar una opción y cerrar el dropdown
  seleccionarOpcion(opcion: string) {
    this.opcion = opcion;
    this.showDropdown = false; // Cierra el dropdown al seleccionar una opción
    console.log(`Opción seleccionada: ${opcion}`);
    this.filtrarDatos(); // Filtra los datos cuando se selecciona una opción
  }

  ordenActual: { [key in keyof FilaCaja]?: boolean } = {};

  ordenarTabla(campo: keyof FilaCaja) {
    const esAscendente = this.ordenActual[campo] ?? true;
    this.datos.sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];
      if (campo === 'monto') {
        const valorANum = parseFloat(valorA as string);
        const valorBNum = parseFloat(valorB as string);
        return esAscendente ? valorANum - valorBNum : valorBNum - valorANum;
      }
      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return esAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
      } 
      else if (typeof valorA === 'number' && typeof valorB === 'number') {
        return esAscendente ? valorA - valorB : valorB - valorA;
      } 
      else {
        return 0;
      }
    });
    this.ordenActual[campo] = !esAscendente;
  }
  
  agregarFila(tipo: string) {
    if (tipo === 'Agregar') {
      if (isNaN(Number(this.entrada)) || this.entrada.trim() === '') {
        alert('Por favor, ingrese un número válido para "Entrada".');
        return;
      }
    }
  
    if (tipo === 'Salida') {
      if (isNaN(Number(this.salida)) || this.salida.trim() === '') {
        alert('Por favor, ingrese un número válido para "Salida".');
        return;
      }
    }
    const fecha = new Date();
    const nuevaFila = {
      fecha: fecha.toLocaleDateString(),
      hora: fecha.toLocaleTimeString(),
      tipo: tipo,
      monto: tipo === 'Agregar' ? this.entrada : this.salida,
      usuario: 'UsuarioX',
      nota: this.nota
    };
  
    this.addTareaBD(nuevaFila);
    this.datos.unshift(nuevaFila); 
    this.entrada = '';
    this.salida = '';
    this.nota = '';
  }
  addTareaBD(tarea: any) {
    console.log('Enviando tarea al servidor:', tarea); // Log para depuración
    this.cajaService.create(tarea).subscribe({
      next: (tarea) => {
        console.log('Tarea agregada correctamente:', tarea);
      },
      error: (err) => {
        console.error('Error al intentar agregar tarea:', err);
      }
    });
  }
}

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilaCliente } from '../../../interfaces/tablas.interface';
import { ClientesService } from '../../../services/clientes-service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  // Campos del formulario
  id: string = ''; // ID que se puede rellenar o se genera automáticamente
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  contacto: string = '';
  nota: string = '';

  // Datos de la tabla
  datos: FilaCliente[] = [];
  filtro: string = '';
  ordenAscendente: boolean = true;

  // Opciones del dropdown
  opciones: string[] = ['Nombre', 'Apellido', 'Dni', 'Contacto', 'Nota'];
  showDropdown: boolean = false;
  opcion: string = 'Nombre'; // Opción por defecto

  // Menú contextual
  mostrarMenu = false;
  menuTop = 0;
  menuLeft = 0;
  filaSeleccionada: number | null = null;
  indiceEditando: number | undefined = undefined; // Índice de la fila en edición

  // Campos relacionados con funcionalidades avanzadas
  paginaActual: number = 1;
  totalPaginas: number = 1;

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.cargarClientesPaginados(this.paginaActual);
  }

  cargarClientesPaginados(pagina: number) {
    this.clientesService.getPaginados(pagina).subscribe({
      next: (respuesta) => {
        this.datos = respuesta.clientes;
        this.totalPaginas = respuesta.totalPaginas;
      },
      error: (err) => console.error('Error al cargar clientes paginados:', err)
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  cambiarPagina(incremento: number) {
    const nuevaPagina = this.paginaActual + incremento;
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarClientesPaginados(this.paginaActual);
    }
  }

  buscarEnBaseDatos() {
    this.clientesService.buscar(this.filtro.trim()).subscribe({
      next: (resultados) => {
        this.datos = resultados;
      },
      error: (err) => console.error('Error en la búsqueda:', err)
    });
  }

  filtrarDatos() {
    if (!this.filtro.trim()) {
      this.cargarClientesPaginados(this.paginaActual);
      return;
    }
  }

  seleccionarOpcion(opcion: string): void {
    this.opcion = opcion; // Asigna la opción seleccionada
    this.showDropdown = false; // Cierra el dropdown
    this.filtrarDatos(); // Vuelve a filtrar los datos según la opción seleccionada (si lo necesitas)
  }


  agregarCliente() {
    if (!this.validarFormulario()) {
      return;
    }

    // Si no se proporciona un ID, se genera automáticamente
    if (!this.id) {
      this.id = this.generarId();
    }

    const clienteExistente = this.datos.find(cliente => cliente.id === this.id);

    const nuevoCliente: FilaCliente = {
      id: this.id,
      Nombre: this.nombre,
      Apellido: this.apellido,
      Dni: this.dni,
      Contacto: this.contacto,
      nota: this.nota
    };

    if (clienteExistente) {
      // Si el cliente ya existe, lo editamos
      this.editarCliente(clienteExistente, nuevoCliente);
    } else {
      // Si el cliente no existe, lo agregamos
      this.addClienteBD(nuevoCliente);
      this.datos.unshift(nuevoCliente);
    }

    this.limpiarFormulario();
  }

  generarId(): string {
    return (Math.random() * 10000).toString(); // Genera un ID único aleatorio
  }

  editarCliente(clienteExistente: FilaCliente, nuevoCliente: FilaCliente) {
    // Actualiza los datos del cliente
    clienteExistente.Nombre = nuevoCliente.Nombre;
    clienteExistente.Apellido = nuevoCliente.Apellido;
    clienteExistente.Dni = nuevoCliente.Dni;
    clienteExistente.Contacto = nuevoCliente.Contacto;
    clienteExistente.nota = nuevoCliente.nota;

    this.clientesService.update(Number(clienteExistente.id), clienteExistente).subscribe({
      next: (actualizado) => console.log('Cliente actualizado:', actualizado),
      error: (err) => console.error('Error al actualizar cliente:', err),
    });
  }

  validarFormulario(): boolean {
    if (!this.nombre.trim() || !this.apellido.trim() || !this.dni.trim() || !this.contacto.trim()) {
      alert('Todos los campos son obligatorios.');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.id = '';
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.contacto = '';
    this.nota = '';
  }

  addClienteBD(cliente: FilaCliente) {
    this.clientesService.create(cliente).subscribe({
      next: (cliente) => console.log('Cliente agregado correctamente:', cliente),
      error: (err) => console.error('Error al agregar cliente:', err),
    });
  }

  eliminarFila(index: number | null) {
    if (index === null || index < 0 || index >= this.datos.length) {
      console.error('Índice inválido.');
      return;
    }

    const clienteEliminado = this.datos[index];
    if (clienteEliminado.id !== undefined) {
      this.clientesService.delete(Number(clienteEliminado.id)).subscribe({
        next: () => {
          this.datos.splice(index, 1);
          this.mostrarMenu = false;
        },
        error: (err) => console.error('Error al eliminar el cliente:', err),
      });
    }
  }

  ordenarTabla(campo: keyof FilaCliente) {
    this.ordenAscendente = !this.ordenAscendente;
    this.datos.sort((a, b) => {
      if (a[campo] < b[campo]) {
        return this.ordenAscendente ? -1 : 1;
      } else if (a[campo] > b[campo]) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });
  }

  mostrarOpciones(event: MouseEvent, index: number) {
    this.filaSeleccionada = index;
    this.menuTop = event.clientY;
    this.menuLeft = event.clientX;
    this.mostrarMenu = true;
  }

  editarFila(index: number | null) {
    if (index === null) return;
    const cliente = this.datos[index];
    this.id = cliente.id;
    this.nombre = cliente.Nombre;
    this.apellido = cliente.Apellido;
    this.dni = cliente.Dni;
    this.contacto = cliente.Contacto;
    this.nota = cliente.nota;
    this.mostrarMenu = false;
  }

  limpiarFormularioEdicion() {
    this.id = '';
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.contacto = '';
    this.nota = '';
  }
}

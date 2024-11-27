import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilaProducto, Talle } from '../../../interfaces/tablas.interface';
import { ProductosService } from '../../../services/productos-service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  // Campos del formulario
  id: string = '';
  producto: string = '';
  cantidad: string = '';
  color: string = '';
  talle: Talle | null = null;
  precio: string = '';

  // Datos de la tabla
  datos: FilaProducto[] = [];
  filtro: string = '';
  ordenAscendente: boolean = true;

  // Opciones del dropdown
  opciones: string[] = ['Producto', 'Cantidad', 'Color', 'Talle', 'Precio'];
  showDropdown: boolean = false;
  opcion: string = 'Producto'; // Opción por defecto

  // Talles disponibles
  tallesDisponibles = Object.values(Talle);

  // Menú contextual
  mostrarMenu = false;
  menuTop = 0;
  menuLeft = 0;
  filaSeleccionada: number | null = null;

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarUltimosDiezProductos(); // Cargar los últimos 10 productos al iniciar
  }

  // Limita los datos a mostrar a las primeras 10 filas
  get datosLimitados() {
    return this.datos.slice(0, 10);
  }

  cargarUltimosDiezProductos() {
    this.productosService.getUltimosDiez().subscribe({
      next: (datos) => {
        this.datos = datos; // `datos` ya debería ser un arreglo de objetos
        this.filtrarDatos(); // Filtrar los datos si hay un filtro
      },
      error: (err) => {
        console.error('Error al cargar los últimos 10 productos:', err);
      }
    });
  }

  // Realiza la búsqueda y filtrado de datos en función de la opción seleccionada
  buscarEnBaseDatos() {
    this.filtrarDatos(); // Filtra los datos localmente

    // Si el filtro está vacío, cargar los últimos 10 productos
    if (!this.filtro.trim()) {
      this.cargarUltimosDiezProductos();
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
      const valorCampo = item[this.opcion.toLowerCase() as keyof FilaProducto]?.toString().toLowerCase();
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

  ordenActual: { [key in keyof FilaProducto]?: boolean } = {};

  ordenarTabla(campo: keyof FilaProducto) {
    const esAscendente = this.ordenActual[campo] ?? true;
    this.datos.sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];
      if (campo === 'cantidad' || campo === 'precio') {
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

  generarId(): string {
    return String(Math.floor(10000 + Math.random() * 90000)); // Genera un ID único aleatorio
  }


  validarFormulario(): boolean {
    if (this.talle && typeof this.talle === 'string') {
      this.talle = this.talle.toUpperCase() as Talle;
    }
    if (!this.producto.trim()) {
      alert('Por favor, ingrese un nombre de producto válido.');
      return false;
    }
    if (isNaN(Number(this.cantidad)) || Number(this.cantidad) <= 0) {
      alert('Por favor, ingrese una cantidad válida.');
      return false;
    }
    if (!this.color.trim()) {
      alert('Por favor, ingrese un color válido.');
      return false;
    }
    if (!Object.values(Talle).includes(this.talle as Talle)) {
      alert('Por favor, seleccione un talle válido.');
      return false;
    }
    if (isNaN(Number(this.precio)) || Number(this.precio) <= 0) {
      alert('Por favor, ingrese un precio válido.');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.id = '';
    this.producto = '';
    this.cantidad = '';
    this.color = '';
    this.talle = null;
    this.precio = '';
  }

  addProductoBD(producto: FilaProducto) {
    console.log('Enviando producto al servidor:', producto); // Log para depuración
    this.productosService.create(producto).subscribe({
      next: (producto) => {
        console.log('Producto agregado correctamente:', producto);
      },
      error: (err) => {
        console.error('Error al intentar agregar producto:', err);
      }
    });
  }
// Mostrar menú contextual al hacer doble clic en una fila
mostrarOpciones(event: MouseEvent, index: number) {
  event.preventDefault(); // Evitar el comportamiento predeterminado
  this.menuTop = event.clientY;
  this.menuLeft = event.clientX;
  this.mostrarMenu = true;
  this.filaSeleccionada = index; // Guarda el índice de la fila seleccionada
}

// Eliminar la fila seleccionada
eliminarFila(index: number | null) {
  if (index === null || index < 0 || index >= this.datos.length) {
    console.error('Índice inválido para eliminar fila.');
    return;
  }

  const productoEliminado = this.datos[index];
  if (productoEliminado.id !== undefined) {
    this.productosService.delete(Number(productoEliminado.id)).subscribe({
      next: () => {
        console.log('Producto eliminado:', productoEliminado);
        this.datos.splice(index, 1); // Eliminar de la tabla local
        this.mostrarMenu = false; // Ocultar el menú contextual
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      },
    });
  } else {
    console.error('No se puede eliminar el producto porque no tiene un ID asignado.');
  }
}

// Cerrar el menú contextual si se hace clic fuera de él
@HostListener('document:click', ['$event'])
cerrarMenu(event: MouseEvent) {
  const clickedInside = (event.target as HTMLElement).closest('.menu-contextual');
  if (!clickedInside) {
    this.mostrarMenu = false;
  }
}
editarProducto(productoExistente: FilaProducto, nuevoProducto: FilaProducto) {
  // Actualiza los datos del producto
  productoExistente.producto = nuevoProducto.producto;
  productoExistente.cantidad = nuevoProducto.cantidad;
  productoExistente.color = nuevoProducto.color;
  productoExistente.talle = nuevoProducto.talle;
  productoExistente.precio = nuevoProducto.precio;

  // Llama al servicio para guardar los cambios en la base de datos
  this.productosService.update(Number(productoExistente.id), productoExistente).subscribe({
    next: (actualizado) => console.log('Producto actualizado:', actualizado),
    error: (err) => console.error('Error al actualizar producto:', err),
  });
}

editarFila(index: number | null) {
  if (index === null) return;
  const producto = this.datos[index];

  // Llena el formulario con los datos del producto seleccionado
  this.id = producto.id;
  this.producto = producto.producto;
  this.cantidad = producto.cantidad.toString();
  this.color = producto.color;
  this.talle = producto.talle;
  this.precio = producto.precio.toString();

  // Limpia el menú contextual si estaba abierto
  this.mostrarMenu = false;
}

agregarProducto() {
  if (!this.validarFormulario()) {
    return;
  }

  // Generar un ID si no se proporciona
  if (!this.id) {
    this.id = this.generarId();
  }

  const nuevoProducto: FilaProducto = {
    id: this.id, // Asegúrate de que el ID se está asignando aquí
    producto: this.producto,
    cantidad: Number(this.cantidad),
    color: this.color,
    talle: this.talle!,
    precio: Number(this.precio),
  };

  // Agregar el producto a la base de datos
  this.addProductoBD(nuevoProducto);

  // Insertar el producto en la tabla
  this.datos.unshift(nuevoProducto);

  // Limpiar el formulario
  this.limpiarFormulario();
}
}

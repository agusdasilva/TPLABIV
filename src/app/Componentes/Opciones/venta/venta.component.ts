import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos-service';
import { ClientesService } from '../../../services/clientes-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent {
  productoId: string = '';
  cantidadProducto: number = 1;
  clienteId: string = '';
  carrito: Array<any> = [];
  precioTotal: number = 0;

  constructor(
    private productosService: ProductosService,
    private clientesService: ClientesService
  ) {}

  // Método para agregar al carrito
  agregarAlCarrito() {
    if (!this.productoId || this.cantidadProducto <= 0) {
      alert('Por favor, completa los campos correctamente.');
      return;
    }

    this.productosService.getById(Number(this.productoId)).subscribe({
      next: (producto) => {
        if (!producto) {
          alert('Producto no encontrado.');
          return;
        }

        const cliente = this.clienteId
          ? this.buscarClienteEnBaseDatos(Number(this.clienteId))
          : Promise.resolve('Sin asignar');

        cliente.then((nombreCliente) => {
          const itemCarrito = {
            id: producto.id,
            producto: producto.nombre,
            cantidad: this.cantidadProducto,
            precioUnitario: producto.precio,
            precioTotal: producto.precio * this.cantidadProducto,
            cliente: nombreCliente,
          };

          this.carrito.push(itemCarrito);
          this.calcularPrecioTotal();
          this.limpiarInputsVenta();
        });
      },
      error: () => {
        alert('Error al buscar el producto.');
      },
    });
  }

  // Método para buscar cliente en la base de datos
  buscarClienteEnBaseDatos(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.clientesService.getById(id).subscribe({
        next: (cliente) => resolve(cliente.nombre),
        error: () => {
          alert('Error al buscar el cliente.');
          reject('Sin asignar');
        },
      });
    });
  }

  // Método para calcular el precio total
  calcularPrecioTotal() {
    this.precioTotal = this.carrito.reduce(
      (total, item) => total + item.precioTotal,
      0
    );
  }

  // Método para limpiar inputs
  limpiarInputsVenta() {
    this.productoId = '';
    this.cantidadProducto = 1;
    this.clienteId = '';
  }

  // Método para confirmar la venta
  confirmarVenta() {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    console.log('Venta confirmada:', this.carrito);
    alert('Venta realizada con éxito.');
    this.carrito = [];
    this.precioTotal = 0;
  }
}

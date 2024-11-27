//Caja
export interface FilaCaja {
  fecha: string;
  hora: string;
  tipo: string;
  monto: string | number;
  usuario: string;
  nota: string;
}

//Productos
export enum Talle {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}
export interface FilaProducto {
  id: string;
  producto: string;
  cantidad: string | number;
  color: string;
  talle: Talle;
  precio: string | number;
}

//Clientes
export interface FilaCliente {
  id: string;
  Nombre: string;
  Apellido: string;
  Dni: string;
  Contacto: string;
  nota: string;
}
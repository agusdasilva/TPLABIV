import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilaCliente } from '../interfaces/tablas.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private url = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
  getUltimosDiez(): Observable<FilaCliente[]> {
    return this.http.get<FilaCliente[]>(`${this.url}?_sort=id&_order=desc&_limit=10`);
  }
  buscar(filtro: string) {
    return this.http.get<FilaCliente[]>(`http://localhost:3000/producto/search`, {
      params: {
        filtro: filtro
      }
    });
  }
  getPaginados(pagina: number, cantidadPorPagina: number = 10): Observable<{ clientes: FilaCliente[]; totalPaginas: number }> {
    const url = `${this.url}?_page=${pagina}&_limit=${cantidadPorPagina}`;
    return this.http.get<FilaCliente[]>(url, { observe: 'response' }).pipe(
      map(response => {
        const totalClientes = Number(response.headers.get('X-Total-Count'));
        const totalPaginas = Math.ceil(totalClientes / cantidadPorPagina);
        return {
          clientes: response.body || [], // Asegurarse de que siempre sea un array
          totalPaginas
        };
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilaProducto } from '../interfaces/tablas.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private url = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) { }

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
  search(filtro: string, campo: string) {
    return this.http.get<FilaProducto[]>(`http://localhost:3000/producto/search`, {
      params: {
        filtro: filtro,
        campo: campo
      }
    });
  }
  getUltimosDiez(): Observable<FilaProducto[]> {
    return this.http.get<FilaProducto[]>(`${this.url}?_sort=id&_order=desc&_limit=10`);
  }
}

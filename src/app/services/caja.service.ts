import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FilaCaja } from '../interfaces/tablas.interface';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private url = 'http://localhost:3000/caja';

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

search(filtro: string, campo: string) {
  return this.http.get<FilaCaja[]>(`http://localhost:3000/caja/search`, {
    params: {
      filtro: filtro,
      campo: campo
    }
  });
}
  getUltimosDiezDeHoy(fecha: string): Observable<any[]> {
    const url = `${this.url}?fecha=${fecha}&_sort=id&_order=desc&_limit=10`;
    return this.http.get<any[]>(url);
  }
}
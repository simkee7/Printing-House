import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Kategorija from '../models/kategorija';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class KategorijaService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/kategorija";

  sve() {
    return this.http.get<Kategorija[]>(`${this.uri}/sve`);
  }

  dodaj(naziv: string, potkategorije: string[]) {
    let data = {
      naziv: naziv,
      potkategorije: potkategorije
    }
    return this.http.post<any>(`${this.uri}/dodaj`, data);
  }

  izmeni(id: string, naziv: string, potkategorije: string[]) {
    let data = {
      _id: id,
      naziv: naziv,
      potkategorije: potkategorije
    }
    return this.http.post<Poruka>(`${this.uri}/izmeni`, data);
  }

  obrisi(id: string) {
    let data = {
      _id: id
    }
    return this.http.post<Poruka>(`${this.uri}/obrisi`, data);
  }

}

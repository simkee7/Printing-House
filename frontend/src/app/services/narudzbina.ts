import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Narudzbina from '../models/narudzbina';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class NarudzbinaService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/narudzbina";

  mojeNarudzbine(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Narudzbina[]>(`${this.uri}/moje`, data)
  }

  otkazi(id: string) {
    let data = {
      id: id
    }
    return this.http.post<Poruka>(`${this.uri}/otkazi`, data)
  }

  kreiraj(klijentKorisnickoIme: string, stavke: any[]) {
    let data = {
      klijentKorisnickoIme: klijentKorisnickoIme,
      stavke: stavke
    }
    return this.http.post<any>(`${this.uri}/kreiraj`, data)
  }

  fakturaUrl(id: string) {
    return `${this.uri}/faktura/${id}`;
  }

  arhiva(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any[]>(`${this.uri}/arhiva`, data)
  }

  potvrdiPrijem(id: string) {
    let data = {
      id: id
    }
    return this.http.post<Poruka>(`${this.uri}/potvrdiPrijem`, data)
  }

  zaStampariju(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any[]>(`${this.uri}/zaStampariju`, data)
  }

  sledeciKorak(id: string) {
    let data = {
      id: id
    }
    return this.http.post<Poruka>(`${this.uri}/sledeciKorak`, data)
  }

  izvestaj(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any>(`${this.uri}/izvestaj`, data)
  }

}

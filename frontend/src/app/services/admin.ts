import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/admin";

  sviKorisnici() {
    return this.http.get<any[]>(`${this.uri}/sviKorisnici`);
  }

  odobriKorisnika(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Poruka>(`${this.uri}/odobriKorisnika`, data);
  }

  deaktivirajKorisnika(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Poruka>(`${this.uri}/deaktivirajKorisnika`, data);
  }

  obrisiKorisnika(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Poruka>(`${this.uri}/obrisiKorisnika`, data);
  }

  azurirajKorisnika(k: any) {
    return this.http.post<any>(`${this.uri}/azurirajKorisnika`, k);
  }

  statistika() {
    return this.http.get<any>(`${this.uri}/statistika`);
  }

  prometPoStamparijama() {
    return this.http.get<any[]>(`${this.uri}/prometPoStamparijama`);
  }

  najtrazenijiProizvodiMesec() {
    return this.http.get<any[]>(`${this.uri}/najtrazenijiProizvodiMesec`);
  }

  ocenaProizvodaKrozVreme() {
    return this.http.get<any[]>(`${this.uri}/ocenaProizvodaKrozVreme`);
  }

}

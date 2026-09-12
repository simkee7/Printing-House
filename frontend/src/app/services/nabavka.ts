import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Nabavka from '../models/nabavka';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class NabavkaService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/nabavka";

  kreirajIzKorpe(klijentKorisnickoIme: string, stavke: any[]) {
    let data = {
      klijentKorisnickoIme: klijentKorisnickoIme,
      stavke: stavke
    }
    return this.http.post<any>(`${this.uri}/kreirajIzKorpe`, data)
  }

  moje(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Nabavka[]>(`${this.uri}/moje`, data)
  }

  otvorene() {
    return this.http.get<Nabavka[]>(`${this.uri}/otvorene`)
  }

  mojePonude(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any[]>(`${this.uri}/mojePonude`, data)
  }

  posaljiPonudu(nabavkaId: string, stamparijaKorisnickoIme: string, cenaUkupno: number, rokIsporukeDana: number) {
    let data = {
      nabavkaId: nabavkaId,
      stamparijaKorisnickoIme: stamparijaKorisnickoIme,
      cenaUkupno: cenaUkupno,
      rokIsporukeDana: rokIsporukeDana
    }
    return this.http.post<Poruka>(`${this.uri}/posaljiPonudu`, data)
  }

  detalji(id: string) {
    return this.http.get<Nabavka>(`${this.uri}/${id}`)
  }

  izvestajUrl(id: string) {
    return `${this.uri}/izvestaj/${id}`;
  }

}

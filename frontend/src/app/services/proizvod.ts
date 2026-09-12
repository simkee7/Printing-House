import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Proizvod from '../models/proizvod';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class ProizvodService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/proizvod";
  bazniUrl = "http://localhost:4000";

  pocetnaStatistika() {
    return this.http.get<any>(`${this.uri}/pocetna`);
  }

  kategorije() {
    return this.http.get<string[]>(`${this.uri}/kategorije`);
  }

  pretrazi(naziv: string, kategorija: string) {
    let data = {
      naziv: naziv,
      kategorija: kategorija
    }
    return this.http.post<Proizvod[]>(`${this.uri}/pretraga`, data)
  }

  detalji(id: string) {
    return this.http.get<Proizvod>(`${this.uri}/${id}`)
  }

  slikaPutanja(nazivSlike: string) {
    return `${this.bazniUrl}/uploads/proizvodi/${nazivSlike}`;
  }

  svidi(sifra: string, korisnickoIme: string) {
    let data = {
      sifra: sifra,
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any>(`${this.uri}/svidi`, data)
  }

  nesvidi(sifra: string, korisnickoIme: string) {
    let data = {
      sifra: sifra,
      korisnickoIme: korisnickoIme
    }
    return this.http.post<any>(`${this.uri}/nesvidi`, data)
  }

  komentarisi(sifra: string, korisnickoIme: string, tekst: string) {
    let data = {
      sifra: sifra,
      korisnickoIme: korisnickoIme,
      tekst: tekst
    }
    return this.http.post<Poruka>(`${this.uri}/komentarisi`, data)
  }

  zaStampariju(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<Proizvod[]>(`${this.uri}/zaStampariju`, data)
  }

  dodajProizvod(p: any) {
    return this.http.post<any>(`${this.uri}/dodaj`, p)
  }

  azurirajProizvod(p: any) {
    return this.http.post<any>(`${this.uri}/azurirajProizvod`, p)
  }

  obrisiProizvod(id: string, stamparijaKorisnickoIme: string) {
    let data = {
      _id: id,
      stamparijaKorisnickoIme: stamparijaKorisnickoIme
    }
    return this.http.post<Poruka>(`${this.uri}/obrisiProizvod`, data)
  }

  ucitajIzFajla(stamparijaKorisnickoIme: string, proizvodi: any[]) {
    let data = {
      stamparijaKorisnickoIme: stamparijaKorisnickoIme,
      proizvodi: proizvodi
    }
    return this.http.post<Poruka>(`${this.uri}/ucitajIzFajla`, data)
  }

  otpremiSliku(sifra: string, stamparijaKorisnickoIme: string, slikaUrl?: string, dodatneSlike?: string[]) {
    let data: any = {
      sifra: sifra,
      stamparijaKorisnickoIme: stamparijaKorisnickoIme
    }
    if (slikaUrl !== undefined) data.slikaUrl = slikaUrl;
    if (dodatneSlike !== undefined) data.dodatneSlike = dodatneSlike;

    return this.http.post<Poruka>(`${this.uri}/otpremiSliku`, data)
  }

}

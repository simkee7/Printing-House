import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import User from '../models/user';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  private http = inject(HttpClient);

  uri = "http://localhost:4000/user";

  login(korisnickoIme: string, lozinka: string) {
    let data = {
      korisnickoIme: korisnickoIme,
      lozinka: lozinka
    }
    return this.http.post<User>(`${this.uri}/login`, data)
  }

  getUser(korisnickoIme: string) {
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post<User>(`${this.uri}/getUser`, data)
  }

  register(u: User){
    return this.http.post<Poruka>(`${this.uri}/register`, u)
  }

  promeniLozinku(korisnickoIme: string, staraLozinka: string, novaLozinka: string) {
    let data = {
      korisnickoIme: korisnickoIme,
      staraLozinka: staraLozinka,
      novaLozinka: novaLozinka
    };
    return this.http.post<Poruka>(`${this.uri}/promeniLozinku`, data);
  }

  zaboravljenaLozinka(identifikator: string) {
    let data = {
      korisnickoIme: identifikator,
      email: identifikator
    };
    return this.http.post<Poruka>(`${this.uri}/zaboravljenaLozinka`, data);
  }

  resetujLozinku(token: string, novaLozinka: string) {
    let data = {
      token: token,
      novaLozinka: novaLozinka
    };
    return this.http.post<Poruka>(`${this.uri}/resetujLozinku`, data);
  }

  azurirajProfil(u: User) {
    return this.http.post<User>(`${this.uri}/azurirajProfil`, u);
  }

  getStamparija(nazivInstitucije: string) {
    let data = {
      nazivInstitucije: nazivInstitucije
    }
    return this.http.post<string>(`${this.uri}/getStamparija`, data);
  }

}

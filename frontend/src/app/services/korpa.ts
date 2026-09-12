import { Injectable } from '@angular/core';
import { StavkaKorpe } from '../models/stavka-korpe';

@Injectable({
  providedIn: 'root'
})
export class KorpaService {

  private KLJUC = 'korpa';

  izborZaPripremu: any = null;

  getStavke(): StavkaKorpe[] {
    let sirovo = localStorage.getItem(this.KLJUC);
    return sirovo ? JSON.parse(sirovo) : [];
  }

  private sacuvaj(stavke: StavkaKorpe[]) {
    localStorage.setItem(this.KLJUC, JSON.stringify(stavke));
  }

  dodaj(stavka: StavkaKorpe) {
    let stavke = this.getStavke();
    stavke.push(stavka);
    this.sacuvaj(stavke);
  }

  ukloni(indeks: number) {
    let stavke = this.getStavke();
    stavke.splice(indeks, 1);
    this.sacuvaj(stavke);
  }

  isprazni() {
    localStorage.removeItem(this.KLJUC);
  }

}

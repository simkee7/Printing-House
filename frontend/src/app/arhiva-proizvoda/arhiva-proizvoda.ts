import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NarudzbinaService } from '../services/narudzbina';
import { ProizvodService } from '../services/proizvod';

@Component({
  selector: 'app-arhiva-proizvoda',
  imports: [FormsModule, DatePipe],
  templateUrl: './arhiva-proizvoda.html',
  styleUrl: './arhiva-proizvoda.css',
})
export class ArhivaProizvodaComponent {

  private narudzbinaService = inject(NarudzbinaService);
  private proizvodService = inject(ProizvodService);

  korisnickoIme: string = "";
  narudzbine: any[] = [];
  stavke: any[] = [];
  poljeSort: string = "datumNarucivanja";
  smerSort: string = "desc";

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
    this.ucitaj();
  }

  ucitaj() {
    this.narudzbinaService.arhiva(this.korisnickoIme).subscribe(data => {
      this.narudzbine = data;

      let sve: any[] = [];
      data.forEach((n: any) => {
        n.stavke.forEach((s: any) => {
          sve.push({
            narudzbinaId: n._id,
            nazivStamparije: n.nazivStamparije,
            datumNarucivanja: n.datumNarucivanja,
            status: n.status,
            ...s
          });
        });
      });

      this.stavke = sve;
      this.primeniSortiranje();
    });
  }

  sortiraj(polje: string) {
    if (this.poljeSort === polje) {
      this.smerSort = this.smerSort === 'asc' ? 'desc' : 'asc';
    } else {
      this.poljeSort = polje;
      this.smerSort = 'asc';
    }

    this.primeniSortiranje();
  }

  private primeniSortiranje() {
    this.stavke.sort((a: any, b: any) => {
      let va = a[this.poljeSort];
      let vb = b[this.poljeSort];
      let rez = 0;
      if (va < vb) rez = -1;
      if (va > vb) rez = 1;
      return this.smerSort === 'asc' ? rez : -rez;
    });
  }

  potvrdiPrijem(s: any) {
    this.narudzbinaService.potvrdiPrijem(s.narudzbinaId).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

  svidi(stavka: any) {
    if (!stavka.sifra) return;

    this.proizvodService.svidi(stavka.sifra, this.korisnickoIme).subscribe(data => {
      stavka.brojSvidjanja = data.brojSvidjanja;
      stavka.brojNesvidjanja = data.brojNesvidjanja;
      stavka.daLiSamSvideo = data.daLiSamSvideo;
      stavka.daLiSamNesvideo = data.daLiSamNesvideo;
    });
  }

  nesvidi(stavka: any) {
    if (!stavka.sifra) return;

    this.proizvodService.nesvidi(stavka.sifra, this.korisnickoIme).subscribe(data => {
      stavka.brojSvidjanja = data.brojSvidjanja;
      stavka.brojNesvidjanja = data.brojNesvidjanja;
      stavka.daLiSamSvideo = data.daLiSamSvideo;
      stavka.daLiSamNesvideo = data.daLiSamNesvideo;
    });
  }

  komentarisi(stavka: any) {
    if (!stavka.sifra) return;

    this.proizvodService.komentarisi(stavka.sifra, this.korisnickoIme, stavka.mojKomentar).subscribe(data => {
      alert(data.msg);
    });
  }

}

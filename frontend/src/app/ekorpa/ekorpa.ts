import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KorpaService } from '../services/korpa';
import { NarudzbinaService } from '../services/narudzbina';
import { NabavkaService } from '../services/nabavka';
import { StavkaKorpe } from '../models/stavka-korpe';

@Component({
  selector: 'app-ekorpa',
  imports: [FormsModule, RouterLink],
  templateUrl: './ekorpa.html',
  styleUrl: './ekorpa.css',
})
export class EkorpaComponent {

  private korpaService = inject(KorpaService);
  private narudzbinaService = inject(NarudzbinaService);
  private nabavkaService = inject(NabavkaService);

  stavke: StavkaKorpe[] = [];
  grupePoStamparijama: { nazivStamparije: string, stavke: StavkaKorpe[], ukupno: number }[] = [];

  narudzbinaZavrsena: boolean = false;
  kreiraneNarudzbine: any[] = [];

  jePravnoLice: boolean = false;
  nabavkaKreirana: boolean = false;

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    this.jePravnoLice = !!ulogovan && ulogovan.tip === 'pravno lice';

    this.ucitajKorpu();
  }

  ucitajKorpu() {
    this.stavke = this.korpaService.getStavke();

    let mapa = new Map<string, { nazivStamparije: string, stavke: StavkaKorpe[], ukupno: number }>();
    this.stavke.forEach(s => {
      let grupa = mapa.get(s.stamparijaKorisnickoIme);
      if (!grupa) {
        grupa = { nazivStamparije: s.nazivStamparije, stavke: [], ukupno: 0 };
        mapa.set(s.stamparijaKorisnickoIme, grupa);
      }
      grupa.stavke.push(s);
      grupa.ukupno += s.kolicina * s.cenaPoKomadu;
    });

    this.grupePoStamparijama = Array.from(mapa.values());
  }

  ukloni(indeks: number) {
    this.korpaService.ukloni(indeks);
    this.ucitajKorpu();
  }

  ukupanIznosKorpe(): number {
    return this.stavke.reduce((zbir, s) => zbir + s.kolicina * s.cenaPoKomadu, 0);
  }

  potvrdi() {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    let stavkeZaSlanje = this.stavke.map(s => ({
      sifra: s.sifra,
      naziv: s.naziv,
      kategorija: s.kategorija,
      kolicina: s.kolicina,
      tipStampe: s.tipStampe,
      cenaPoKomadu: s.cenaPoKomadu,
      stamparijaKorisnickoIme: s.stamparijaKorisnickoIme
    }));

    if (ulogovan.tip === 'pravno lice') {
      this.nabavkaService.kreirajIzKorpe(ulogovan.korisnickoIme, stavkeZaSlanje).subscribe((data: any) => {
        alert(data.msg);
        if (!data.nabavka) return;

        this.korpaService.isprazni();
        this.nabavkaKreirana = true;
      });
      return;
    }

    this.narudzbinaService.kreiraj(ulogovan.korisnickoIme, stavkeZaSlanje).subscribe((data: any) => {
      if (!data.narudzbine) {
        alert(data.msg);
        return;
      }

      this.kreiraneNarudzbine = data.narudzbine;
      this.korpaService.isprazni();
      this.narudzbinaZavrsena = true;
    });
  }

  fakturaUrl(id: string) {
    return this.narudzbinaService.fakturaUrl(id);
  }

}

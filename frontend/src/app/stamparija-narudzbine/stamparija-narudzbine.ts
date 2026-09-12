import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NarudzbinaService } from '../services/narudzbina';

@Component({
  selector: 'app-stamparija-narudzbine',
  imports: [DatePipe],
  templateUrl: './stamparija-narudzbine.html',
  styleUrl: './stamparija-narudzbine.css',
})
export class StamparijaNarudzbineComponent {

  private narudzbinaService = inject(NarudzbinaService);

  korisnickoIme: string = "";
  narudzbine: any[] = [];

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
    this.ucitaj();
  }

  ucitaj() {
    this.narudzbinaService.zaStampariju(this.korisnickoIme).subscribe(data => {
      this.narudzbine = data;
    });
  }

  stavkeTekst(n: any): string {
    return n.stavke.map((s: any) => `${s.naziv} (${s.kolicina})`).join(', ');
  }

  sledeciNaziv(status: string): string {
    if (status === 'placeno') return 'Zapocni stampu';
    if (status === 'u stampi') return 'Oznaci kao isporuceno';
    return '';
  }

  sledeciKorak(n: any) {
    this.narudzbinaService.sledeciKorak(n._id).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

}

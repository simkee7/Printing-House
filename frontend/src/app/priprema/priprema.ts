import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProizvodService } from '../services/proizvod';
import { KorpaService } from '../services/korpa';
import { StavkaKorpe } from '../models/stavka-korpe';

@Component({
  selector: 'app-priprema',
  imports: [FormsModule],
  templateUrl: './priprema.html',
  styleUrl: './priprema.css',
})
export class PripremaComponent {

  private router = inject(Router);
  private proizvodService = inject(ProizvodService);
  private korpaService = inject(KorpaService);

  izbor: any = null;
  kolicina: number = 1;
  personalizacijaTekst: string = "";
  personalizacijaSlika: string = "";

  ngOnInit(): void {
    this.izbor = this.korpaService.izborZaPripremu;

    if (!this.izbor) {
      this.router.navigate(['/klijent/pretraga']);
    }
  }

  putanjaSlike(nazivSlike: string) {
    if (!nazivSlike) return '';
    if (nazivSlike.startsWith('data:')) return nazivSlike;
    return this.proizvodService.slikaPutanja(nazivSlike);
  }

  onSlikaSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(f.type)) {
      alert('Dozvoljeni su JPG/PNG/GIF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.personalizacijaSlika = reader.result as string;
    };
    reader.readAsDataURL(f);
  }

  ponisti() {
    this.kolicina = 1;
    this.personalizacijaTekst = "";
    this.personalizacijaSlika = "";
  }

  nazad() {
    this.router.navigate(['/klijent/proizvod', this.izbor.proizvodId]);
  }

  dodajUKorpu() {
    if (!this.kolicina || this.kolicina < 1) {
      alert('Kolicina mora biti bar 1.');
      return;
    }

    if (this.kolicina > this.izbor.kolicinaNaLageru) {
      alert('Nema dovoljno proizvoda trenutno na stanju.');
      return;
    }

    let stavka = new StavkaKorpe();
    stavka.sifra = this.izbor.sifra;
    stavka.naziv = this.izbor.naziv;
    stavka.kategorija = this.izbor.kategorija;
    stavka.kolicina = this.kolicina;
    stavka.tipStampe = this.izbor.tipStampe;
    stavka.cenaPoKomadu = this.izbor.cenaPoKomadu;
    stavka.stamparijaKorisnickoIme = this.izbor.stamparijaKorisnickoIme;
    stavka.nazivStamparije = this.izbor.nazivStamparije;
    stavka.boja = this.izbor.boja;
    stavka.personalizacijaTekst = this.personalizacijaTekst;
    stavka.personalizacijaSlika = this.personalizacijaSlika;

    this.korpaService.dodaj(stavka);
    this.korpaService.izborZaPripremu = null;

    this.router.navigate(['/ekorpa']);
  }

}

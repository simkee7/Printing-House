import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProizvodService } from '../services/proizvod';
import { KategorijaService } from '../services/kategorija';

@Component({
  selector: 'app-stamparija-proizvodi',
  imports: [FormsModule, RouterLink],
  templateUrl: './stamparija-proizvodi.html',
  styleUrl: './stamparija-proizvodi.css',
})
export class StamparijaProizvodiComponent {

  private proizvodService = inject(ProizvodService);
  private kategorijaService = inject(KategorijaService);

  korisnickoIme: string = "";
  proizvodi: any[] = [];
  izmena: any = null;
  bojeTekst: string = "";

  kategorije: any[] = [];
  noviNaziv: string = "";
  noviOpis: string = "";
  novaKategorija: string = "";
  novaPotkategorija: string = "";
  novaCena: number | null = null;
  novaKolicina: number = 0;
  novaBojeTekst: string = "";
  novaGlavnaSlika: string = "";
  noveDodatneSlike: string[] = [];
  noveUsluge: { tipStampe: string, dodatnaCenaPoKomadu: number | null, maxSirinaMm: number | null, maxVisinaMm: number | null }[] = [];

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
    this.ucitaj();

    this.kategorijaService.sve().subscribe(data => {
      this.kategorije = data;
    });
  }

  ucitaj() {
    this.proizvodService.zaStampariju(this.korisnickoIme).subscribe(data => {
      this.proizvodi = data;
    });
  }

  potkategorijeZaNovu(): string[] {
    let k = this.kategorije.find(k => k.naziv === this.novaKategorija);
    return k ? k.potkategorije : [];
  }

  onKategorijaPromenjena() {
    this.novaPotkategorija = "";
  }

  onGlavnaSlikaOdabrana(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.ucitajKaoDataUrl(input.files[0]).then(dataUrl => {
      this.novaGlavnaSlika = dataUrl;
    });
  }

  onDodatneSlikeOdabrane(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    let fajlovi = Array.from(input.files).slice(0, 3);
    Promise.all(fajlovi.map(f => this.ucitajKaoDataUrl(f))).then(dataUrlovi => {
      this.noveDodatneSlike = dataUrlovi;
    });
  }

  private ucitajKaoDataUrl(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  dodajUslugu() {
    this.noveUsluge.push({ tipStampe: "", dodatnaCenaPoKomadu: null, maxSirinaMm: null, maxVisinaMm: null });
  }

  ukloniUslugu(indeks: number) {
    this.noveUsluge.splice(indeks, 1);
  }

  dodajProizvod() {
    if (!this.noviNaziv || !this.novaKategorija || !this.novaPotkategorija || !this.novaCena) {
      alert('Popunite naziv, kategoriju, potkategoriju i jedinicnu cenu.');
      return;
    }

    let podaci = {
      stamparijaKorisnickoIme: this.korisnickoIme,
      naziv: this.noviNaziv,
      opis: this.noviOpis,
      kategorija: this.novaKategorija,
      potkategorija: this.novaPotkategorija,
      jedinicnaCena: this.novaCena,
      kolicinaNaLageru: this.novaKolicina,
      dostupneBoje: this.novaBojeTekst.split(',').map(b => b.trim()).filter(b => !!b),
      slikaUrl: this.novaGlavnaSlika,
      dodatneSlike: this.noveDodatneSlike,
      uslugeStampe: this.noveUsluge
        .filter(u => u.tipStampe)
        .map((u, indeks) => ({
          idUsluge: `USL-${this.korisnickoIme}-${indeks + 1}`,
          tipStampe: u.tipStampe,
          dodatnaCenaPoKomadu: u.dodatnaCenaPoKomadu || 0,
          maxSirinaMm: u.maxSirinaMm || undefined,
          maxVisinaMm: u.maxVisinaMm || undefined
        }))
    };

    this.proizvodService.dodajProizvod(podaci).subscribe((data: any) => {
      alert(data.msg);
      if (!data.proizvod) return;

      this.ponistiFormuDodavanja();
      this.ucitaj();
    });
  }

  ponistiFormuDodavanja() {
    this.noviNaziv = "";
    this.noviOpis = "";
    this.novaKategorija = "";
    this.novaPotkategorija = "";
    this.novaCena = null;
    this.novaKolicina = 0;
    this.novaBojeTekst = "";
    this.novaGlavnaSlika = "";
    this.noveDodatneSlike = [];
    this.noveUsluge = [];
  }

  izmeni(p: any) {
    this.izmena = { ...p };
    this.bojeTekst = (p.dostupneBoje || []).join(', ');
  }

  otkaziIzmenu() {
    this.izmena = null;
  }

  slikaZaPrikaz(slikaUrl: string): string {
    if (!slikaUrl) return '';
    if (slikaUrl.startsWith('data:')) return slikaUrl;
    return this.proizvodService.slikaPutanja(slikaUrl);
  }

  onIzmenaGlavnaSlikaOdabrana(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.ucitajKaoDataUrl(input.files[0]).then(dataUrl => {
      this.izmena.slikaUrl = dataUrl;
    });
  }

  onIzmenaDodatneSlikeOdabrane(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    let fajlovi = Array.from(input.files).slice(0, 3);
    Promise.all(fajlovi.map(f => this.ucitajKaoDataUrl(f))).then(dataUrlovi => {
      this.izmena.dodatneSlike = dataUrlovi;
    });
  }

  sacuvaj() {
    let podaci = {
      _id: this.izmena._id,
      stamparijaKorisnickoIme: this.korisnickoIme,
      naziv: this.izmena.naziv,
      opis: this.izmena.opis,
      kategorija: this.izmena.kategorija,
      potkategorija: this.izmena.potkategorija,
      jedinicnaCena: this.izmena.jedinicnaCena,
      kolicinaNaLageru: this.izmena.kolicinaNaLageru,
      dostupneBoje: this.bojeTekst.split(',').map(b => b.trim()).filter(b => !!b),
      slikaUrl: this.izmena.slikaUrl,
      dodatneSlike: this.izmena.dodatneSlike
    };

    this.proizvodService.azurirajProizvod(podaci).subscribe((data: any) => {
      if (data && data.msg && !data._id) {
        alert(data.msg);
      } else {
        alert('Proizvod je uspesno azuriran.');
        this.otkaziIzmenu();
        this.ucitaj();
      }
    });
  }

  obrisi(p: any) {
    this.proizvodService.obrisiProizvod(p._id, this.korisnickoIme).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

}

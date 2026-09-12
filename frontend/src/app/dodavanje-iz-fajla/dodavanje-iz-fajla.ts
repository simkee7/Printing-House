import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProizvodService } from '../services/proizvod';

@Component({
  selector: 'app-dodavanje-iz-fajla',
  imports: [],
  templateUrl: './dodavanje-iz-fajla.html',
  styleUrl: './dodavanje-iz-fajla.css',
})
export class DodavanjeIzFajlaComponent {

  private proizvodService = inject(ProizvodService);

  korisnickoIme: string = "";
  brojZaPregled: number = 0;
  sadrzajFajla: any[] | null = null;

  korakSlike: boolean = false;
  proizvodiZaSlike: any[] = [];

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
  }

  onFileSelected(ev: Event) {
    this.sadrzajFajla = null;
    this.brojZaPregled = 0;

    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let sadrzaj = JSON.parse(reader.result as string);

        let niz = Array.isArray(sadrzaj) ? sadrzaj : sadrzaj?.proizvodi;

        if (!Array.isArray(niz)) {
          alert('Fajl mora sadrzati proizvode u polju "proizvodi", u formatu iz Priloga 1.');
          return;
        }

        this.sadrzajFajla = niz;
        this.brojZaPregled = niz.length;
      } catch (e) {
        alert('Fajl nije ispravan JSON.');
      }
    };
    reader.readAsText(f);
  }

  potvrdiUcitavanje() {
    if (!this.sadrzajFajla) return;

    this.proizvodService.ucitajIzFajla(this.korisnickoIme, this.sadrzajFajla).subscribe(data => {
      alert(data.msg);

      this.proizvodiZaSlike = (this.sadrzajFajla || [])
        .filter(p => !!p.sifra)
        .map(p => ({ sifra: p.sifra, naziv: p.naziv, glavnaSlika: null as string | null, dodatneSlike: [] as string[] }));
      this.korakSlike = this.proizvodiZaSlike.length > 0;

      this.sadrzajFajla = null;
      this.brojZaPregled = 0;
    });
  }

  glavnaSlikaOdabrana(ev: Event, stavka: any) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.ucitajKaoDataUrl(input.files[0]).then(dataUrl => {
      stavka.glavnaSlika = dataUrl;
    });
  }

  dodatneSlikeOdabrane(ev: Event, stavka: any) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    let fajlovi = Array.from(input.files).slice(0, 3);
    Promise.all(fajlovi.map(f => this.ucitajKaoDataUrl(f))).then(dataUrlovi => {
      stavka.dodatneSlike = dataUrlovi;
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

  sacuvajSlike(stavka: any) {
    let glavna = stavka.glavnaSlika ?? undefined;
    let dodatne = stavka.dodatneSlike && stavka.dodatneSlike.length > 0 ? stavka.dodatneSlike : undefined;

    if (glavna === undefined && dodatne === undefined) {
      alert('Niste izabrali nijednu sliku.');
      return;
    }

    this.proizvodService.otpremiSliku(stavka.sifra, this.korisnickoIme, glavna, dodatne).subscribe(data => {
      alert(data.msg);
    });
  }

  zavrsi() {
    this.korakSlike = false;
    this.proizvodiZaSlike = [];
  }

}

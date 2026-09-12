import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProizvodService } from '../services/proizvod';

@Component({
  selector: 'app-proizvod-detalji',
  imports: [RouterLink, DatePipe],
  templateUrl: './proizvod-detalji.html',
  styleUrl: './proizvod-detalji.css',
})
export class ProizvodDetaljiComponent {

  private route = inject(ActivatedRoute);
  private proizvodService = inject(ProizvodService);

  proizvod: any = null;
  glavniIndeks: number = 0;
  korisnickoIme: string = "";

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    this.korisnickoIme = ulogovan ? ulogovan.korisnickoIme : '';

    let id = this.route.snapshot.params['id'];

    this.proizvodService.detalji(id).subscribe(data => {
      this.proizvod = data;

      let sacuvaniIndeks = this.procitajKolacic('glavnaSlikaProizvoda_' + id);
      let brojSlika = this.sveSlike().length;
      if (sacuvaniIndeks !== null && +sacuvaniIndeks < brojSlika) {
        this.glavniIndeks = +sacuvaniIndeks;
      } else {
        this.glavniIndeks = 0;
      }
    });
  }

  sveSlike(): string[] {
    if (!this.proizvod) return [];
    let slike = [this.proizvod.slikaUrl, ...((this.proizvod.dodatneSlike || []).slice(0, 3))];
    return slike.filter(s => !!s);
  }

  putanjaSlike(nazivSlike: string) {
    if (!nazivSlike) return '';
    if (nazivSlike.startsWith('data:')) return nazivSlike;
    return this.proizvodService.slikaPutanja(nazivSlike);
  }

  izaberiSliku(indeks: number) {
    this.glavniIndeks = indeks;
    this.sacuvajKolacic('glavnaSlikaProizvoda_' + this.proizvod._id, String(indeks), 30);
  }

  private sacuvajKolacic(ime: string, vrednost: string, brojDana: number) {
    let datum = new Date();
    datum.setTime(datum.getTime() + brojDana * 24 * 60 * 60 * 1000);
    document.cookie = `${ime}=${encodeURIComponent(vrednost)};expires=${datum.toUTCString()};path=/`;
  }

  private procitajKolacic(ime: string): string | null {
    let parovi = document.cookie.split(';');
    for (let par of parovi) {
      let deo = par.trim().split('=');
      if (deo[0] === ime) return decodeURIComponent(deo[1]);
    }
    return null;
  }

}

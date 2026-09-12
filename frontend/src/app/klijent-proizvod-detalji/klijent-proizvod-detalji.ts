import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProizvodService } from '../services/proizvod';
import { KorpaService } from '../services/korpa';

@Component({
  selector: 'app-klijent-proizvod-detalji',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './klijent-proizvod-detalji.html',
  styleUrl: './klijent-proizvod-detalji.css',
})
export class KlijentProizvodDetaljiComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proizvodService = inject(ProizvodService);
  private korpaService = inject(KorpaService);
  private sanitizer = inject(DomSanitizer);

  proizvod: any = null;
  izabranaBoja: string = "";
  izabranaUsluga: any = null;
  korisnickoIme: string = "";

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    this.korisnickoIme = ulogovan ? ulogovan.korisnickoIme : '';

    let id = this.route.snapshot.params['id'];

    this.proizvodService.detalji(id).subscribe(data => {
      this.proizvod = data;
      this.izabranaBoja = (this.proizvod.dostupneBoje && this.proizvod.dostupneBoje[0]) || "";
      this.izabranaUsluga = (this.proizvod.uslugeStampe && this.proizvod.uslugeStampe[0]) || null;
    });
  }

  putanjaSlike(nazivSlike: string) {
    if (!nazivSlike) return '';
    if (nazivSlike.startsWith('data:')) return nazivSlike;
    return this.proizvodService.slikaPutanja(nazivSlike);
  }

  mapaUrl(adresa: string): SafeResourceUrl {
    let upit = encodeURIComponent(adresa || '');
    let url = `https://www.google.com/maps?q=${upit}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  dalje() {
    if (!this.proizvod || this.proizvod.kolicinaNaLageru <= 0) {
      alert('Ovaj proizvod trenutno nije na stanju.');
      return;
    }

    if (this.proizvod.uslugeStampe && this.proizvod.uslugeStampe.length > 0 && !this.izabranaUsluga) {
      alert('Izaberite nacin stampe.');
      return;
    }

    this.korpaService.izborZaPripremu = {
      proizvodId: this.proizvod._id,
      sifra: this.proizvod.sifra,
      naziv: this.proizvod.naziv,
      kategorija: this.proizvod.kategorija,
      slikaUrl: this.proizvod.slikaUrl,
      kolicinaNaLageru: this.proizvod.kolicinaNaLageru,
      stamparijaKorisnickoIme: this.proizvod.stamparijaKorisnickoIme,
      nazivStamparije: this.proizvod.nazivStamparije,
      boja: this.izabranaBoja,
      tipStampe: this.izabranaUsluga ? this.izabranaUsluga.tipStampe : "",
      cenaPoKomadu: this.proizvod.jedinicnaCena + (this.izabranaUsluga ? this.izabranaUsluga.dodatnaCenaPoKomadu : 0)
    };

    this.router.navigate(['/priprema']);
  }

}

import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title="New app"

  private router = inject(Router);
  ulogovan: any = null;

  stavkeMenija: { labela: string, ruta: string }[] = [];

  ngOnInit(): void {
    this.ucitajUlogovanog();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.ucitajUlogovanog();
    });
  }

  private ucitajUlogovanog() {
    let userRaw = localStorage.getItem('ulogovan');
    this.ulogovan = userRaw ? JSON.parse(userRaw) : null;
    this.izracunajMeni();
  }

  private izracunajMeni() {
    if (!this.ulogovan) {
      this.stavkeMenija = [];
      return;
    }

    if (this.ulogovan.tip === 'stamparija') {
      this.stavkeMenija = [
        { labela: 'Profil', ruta: '/stamparija/profil' },
        { labela: 'Narudzbine', ruta: '/stamparija/narudzbine' },
        { labela: 'Proizvodi i usluge', ruta: '/stamparija/proizvodi' },
        { labela: 'Dodavanje iz fajla', ruta: '/stamparija/dodavanjeIzFajla' },
        { labela: 'Javne nabavke', ruta: '/stamparija/nabavke' },
        { labela: 'Izvestavanje', ruta: '/stamparija/izvestavanje' },
      ];
    } else if (this.ulogovan.tip === 'admin') {
      this.stavkeMenija = [
        { labela: 'Korisnici', ruta: '/admin/korisnici' },
        { labela: 'Kategorije', ruta: '/admin/kategorije' },
        { labela: 'Statistika', ruta: '/admin/statistika' },
      ];
    } else {
      this.stavkeMenija = [
        { labela: 'Profil', ruta: '/profil' },
        { labela: 'Pretraga proizvoda', ruta: '/klijent/pretraga' },
        { labela: 'E-korpa', ruta: '/ekorpa' },
        { labela: 'Arhiva proizvoda', ruta: '/arhiva' },
      ];

      if (this.ulogovan.tip === 'pravno lice') {
        this.stavkeMenija.push({ labela: 'Javne nabavke', ruta: '/nabavke' });
      }
    }
  }
}

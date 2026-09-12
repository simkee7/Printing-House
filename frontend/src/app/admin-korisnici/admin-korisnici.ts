import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin';

@Component({
  selector: 'app-admin-korisnici',
  imports: [FormsModule],
  templateUrl: './admin-korisnici.html',
  styleUrl: './admin-korisnici.css',
})
export class AdminKorisniciComponent {

  private adminService = inject(AdminService);

  korisnici: any[] = [];

  korisnickoImeUIzmeni: string = "";
  izmena: any = {};

  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj() {
    this.adminService.sviKorisnici().subscribe(data => {
      this.korisnici = data;
    });
  }

  naCekanju(): any[] {
    return this.korisnici.filter(k => !k.aktivan);
  }

  aktivni(): any[] {
    return this.korisnici.filter(k => k.aktivan);
  }

  odobri(k: any) {
    this.adminService.odobriKorisnika(k.korisnickoIme).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

  odbij(k: any) {
    this.adminService.obrisiKorisnika(k.korisnickoIme).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

  deaktiviraj(k: any) {
    this.adminService.deaktivirajKorisnika(k.korisnickoIme).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

  obrisi(k: any) {
    this.adminService.obrisiKorisnika(k.korisnickoIme).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

  zapocniIzmenu(k: any) {
    this.korisnickoImeUIzmeni = k.korisnickoIme;
    this.izmena = {
      korisnickoIme: k.korisnickoIme,
      ime: k.ime,
      prezime: k.prezime,
      telefon: k.telefon,
      email: k.email,
      nazivInstitucije: k.nazivInstitucije,
      adresaSedista: k.adresaSedista,
      MB: k.MB,
      PIB: k.PIB
    };
  }

  otkaziIzmenu() {
    this.korisnickoImeUIzmeni = "";
    this.izmena = {};
  }

  sacuvajIzmenu() {
    this.adminService.azurirajKorisnika(this.izmena).subscribe((data: any) => {
      alert(data.msg || 'Podaci su azurirani.');
      this.korisnickoImeUIzmeni = "";
      this.izmena = {};
      this.ucitaj();
    });
  }

}

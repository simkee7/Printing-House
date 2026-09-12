import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KategorijaService } from '../services/kategorija';
import Kategorija from '../models/kategorija';

@Component({
  selector: 'app-admin-kategorije',
  imports: [FormsModule],
  templateUrl: './admin-kategorije.html',
  styleUrl: './admin-kategorije.css',
})
export class AdminKategorijeComponent {

  private kategorijaService = inject(KategorijaService);

  kategorije: Kategorija[] = [];

  noviNaziv: string = "";
  novePotkategorije: string = "";

  izmena: any = null;
  potkategorijeTekst: string = "";

  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj() {
    this.kategorijaService.sve().subscribe(data => {
      this.kategorije = data;
    });
  }

  dodaj() {
    if (!this.noviNaziv) {
      alert('Unesite naziv kategorije.');
      return;
    }

    let potkategorije = this.novePotkategorije.split(',').map(p => p.trim()).filter(p => !!p);

    this.kategorijaService.dodaj(this.noviNaziv, potkategorije).subscribe((data: any) => {
      alert(data.msg);
      this.noviNaziv = "";
      this.novePotkategorije = "";
      this.ucitaj();
    });
  }

  izmeni(k: any) {
    this.izmena = { ...k };
    this.potkategorijeTekst = (k.potkategorije || []).join(', ');
  }

  otkaziIzmenu() {
    this.izmena = null;
  }

  sacuvajIzmenu() {
    let potkategorije = this.potkategorijeTekst.split(',').map(p => p.trim()).filter(p => !!p);

    this.kategorijaService.izmeni(this.izmena._id, this.izmena.naziv, potkategorije).subscribe(data => {
      alert(data.msg);
      this.otkaziIzmenu();
      this.ucitaj();
    });
  }

  obrisi(k: any) {
    this.kategorijaService.obrisi(k._id).subscribe(data => {
      alert(data.msg);
      this.ucitaj();
    });
  }

}

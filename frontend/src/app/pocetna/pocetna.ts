import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login';
import { ProizvodService } from '../services/proizvod';
import Proizvod from '../models/proizvod';

@Component({
  selector: 'app-pocetna',
  imports: [FormsModule, RouterLink, LoginComponent],
  templateUrl: './pocetna.html',
  styleUrl: './pocetna.css',
})
export class PocetnaComponent {

  private proizvodService = inject(ProizvodService);

  brojStamparija: number = 0;
  top5: any[] = [];

  nazivPretraga: string = "";
  kategorijaPretraga: string = "Sve kategorije";
  kategorije: string[] = [];
  rezultati: Proizvod[] = [];
  pretragaIzvrsena: boolean = false;
  sortSmer: string = "asc";

  ngOnInit(): void {
    this.proizvodService.pocetnaStatistika().subscribe(data => {
      this.brojStamparija = data.brojStamparija;
      this.top5 = data.top5;
    });

    this.proizvodService.kategorije().subscribe(data => {
      this.kategorije = data;
    });
  }

  pretrazi() {
    this.proizvodService.pretrazi(this.nazivPretraga, this.kategorijaPretraga).subscribe(data => {
      this.rezultati = data;
      this.pretragaIzvrsena = true;
    });
  }

  sortirajPoNazivu() {
    this.sortSmer = this.sortSmer === 'asc' ? 'desc' : 'asc';
    this.rezultati.sort((a, b) => {
      return this.sortSmer === 'asc' ? a.naziv.localeCompare(b.naziv) : b.naziv.localeCompare(a.naziv);
    });
  }

}

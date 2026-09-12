import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProizvodService } from '../services/proizvod';
import Proizvod from '../models/proizvod';

@Component({
  selector: 'app-klijent-pretraga',
  imports: [FormsModule, RouterLink],
  templateUrl: './klijent-pretraga.html',
  styleUrl: './klijent-pretraga.css',
})
export class KlijentPretragaComponent {

  private proizvodService = inject(ProizvodService);

  nazivPretraga: string = "";
  kategorijaPretraga: string = "Sve kategorije";
  kategorije: string[] = [];
  rezultati: Proizvod[] = [];
  pretragaIzvrsena: boolean = false;
  sortSmer: string = "asc";

  ngOnInit(): void {
    this.proizvodService.kategorije().subscribe(data => {
      this.kategorije = data;
    });

    this.pretrazi();
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

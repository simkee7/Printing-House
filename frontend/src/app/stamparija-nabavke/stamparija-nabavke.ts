import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NabavkaService } from '../services/nabavka';

@Component({
  selector: 'app-stamparija-nabavke',
  imports: [FormsModule, DatePipe],
  templateUrl: './stamparija-nabavke.html',
  styleUrl: './stamparija-nabavke.css',
})
export class StamparijaNabavkeComponent {

  private nabavkaService = inject(NabavkaService);

  korisnickoIme: string = "";
  otvorene: any[] = [];
  mojePonude: any[] = [];

  cenaUkupno: { [id: string]: number } = {};
  rokIsporuke: { [id: string]: number } = {};

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
    this.ucitaj();
  }

  ucitaj() {
    this.nabavkaService.otvorene().subscribe(data => {
      this.otvorene = data;
    });

    this.nabavkaService.mojePonude(this.korisnickoIme).subscribe(data => {
      this.mojePonude = data;
    });
  }

  posaljiPonudu(n: any) {
    let cena = this.cenaUkupno[n._id];
    let rok = this.rokIsporuke[n._id];

    if (!cena || !rok) {
      alert('Unesite ukupnu cenu i rok isporuke.');
      return;
    }

    this.nabavkaService.posaljiPonudu(n._id, this.korisnickoIme, cena, rok).subscribe((data: any) => {
      alert(data.msg);
      this.ucitaj();
    });
  }

}

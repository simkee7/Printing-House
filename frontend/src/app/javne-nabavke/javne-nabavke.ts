import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NabavkaService } from '../services/nabavka';

@Component({
  selector: 'app-javne-nabavke',
  imports: [FormsModule, DatePipe],
  templateUrl: './javne-nabavke.html',
  styleUrl: './javne-nabavke.css',
})
export class JavneNabavkeComponent {

  private nabavkaService = inject(NabavkaService);

  korisnickoIme: string = "";

  nabavke: any[] = [];
  otvorenaDetaljiId: string = "";
  detaljiNabavke: any = null;

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.korisnickoIme = ulogovan.korisnickoIme;
    this.ucitaj();
  }

  ucitaj() {
    this.nabavkaService.moje(this.korisnickoIme).subscribe(data => {
      this.nabavke = data;
    });
  }

  prikaziDetalje(n: any) {
    if (this.otvorenaDetaljiId === n._id) {
      this.otvorenaDetaljiId = "";
      this.detaljiNabavke = null;
      return;
    }

    this.otvorenaDetaljiId = n._id;
    this.nabavkaService.detalji(n._id).subscribe(data => {
      this.detaljiNabavke = data;
    });
  }

  izvestajUrl(id: string) {
    return this.nabavkaService.izvestajUrl(id);
  }

}

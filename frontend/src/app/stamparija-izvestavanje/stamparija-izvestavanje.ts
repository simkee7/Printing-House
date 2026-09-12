import { Component, inject } from '@angular/core';
import { NarudzbinaService } from '../services/narudzbina';

@Component({
  selector: 'app-stamparija-izvestavanje',
  imports: [],
  templateUrl: './stamparija-izvestavanje.html',
  styleUrl: './stamparija-izvestavanje.css',
})
export class StamparijaIzvestavanjeComponent {

  private narudzbinaService = inject(NarudzbinaService);

  izvestaj: any = null;

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;
    if (!ulogovan) return;

    this.narudzbinaService.izvestaj(ulogovan.korisnickoIme).subscribe(data => {
      this.izvestaj = data;
    });
  }

}

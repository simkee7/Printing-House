import { Component } from '@angular/core';

@Component({
  selector: 'app-stamparija',
  imports: [],
  templateUrl: './stamparija.html',
  styleUrl: './stamparija.css',
})
export class StamparijaComponent {

  user: any = null;

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    this.user = userRaw ? JSON.parse(userRaw) : null;
  }

}

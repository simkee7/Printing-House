import { Component } from '@angular/core';

@Component({
  selector: 'app-klijent',
  imports: [],
  templateUrl: './klijent.html',
  styleUrl: './klijent.css',
})
export class KlijentComponent {

  user: any = null;
  jePravnoLice: boolean = false;

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    this.user = userRaw ? JSON.parse(userRaw) : null;
    this.jePravnoLice = this.user?.tip === 'pravno lice';
  }

}

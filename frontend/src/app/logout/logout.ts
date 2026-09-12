import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class LogoutComponent {

  private router = inject(Router);

  ngOnInit(): void {
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }

}

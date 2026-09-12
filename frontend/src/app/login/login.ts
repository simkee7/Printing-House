import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  ngOnInit(): void {
    this.isAdminUrl = this.router.url.includes('/admin/login');
  }

  private router = inject(Router);
  private userService = inject(UserService);

  username: string = "";
  password: string = "";
  isAdminUrl: boolean= false;

  ruteZaTip: { [tip: string]: string } = {
    'fizicko lice': '/profil',
    'pravno lice': '/profil',
    'stamparija': '/stamparija/profil',
    'admin': '/admin/statistika'
  };

  login() {
    if (this.username == "" || this.password == "") {
      alert('Niste uneli sve podatke!');
      return;
    }
    this.userService.login(this.username, this.password).subscribe(k => {
      if (k && !this.isAdminUrl && k.tip !='admin') {
        if(k.aktivan){
          localStorage.setItem("ulogovan", JSON.stringify(k));
          this.router.navigateByUrl(this.ruteZaTip[k.tip]);
        }
        else alert('Ceka se odobrenje administratora!');
      }
      else if(k && this.isAdminUrl && k.tip =='admin'){
        localStorage.setItem("ulogovan", JSON.stringify(k));
        this.router.navigateByUrl(this.ruteZaTip[k.tip]);
      }
      else {
        alert('Neispravni podaci!');
      }
    })

  }

}

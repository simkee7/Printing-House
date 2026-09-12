import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user';

@Component({
  selector: 'app-changepassword',
  imports: [FormsModule, RouterLink],
  templateUrl: './changepassword.html',
  styleUrl: './changepassword.css',
})
export class ChangepasswordComponent {

  private userService = inject(UserService);

  staraLozinka: string = "";
  novaLozinka: string = "";
  pwRegex = /^(?=.{8,12}$)(?=[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  pwValid: boolean = false;

  onPasswordInput() {
    this.pwValid = this.pwRegex.test(this.novaLozinka);
  }

  promeni() {
    this.onPasswordInput();

    if (this.staraLozinka == "" || this.novaLozinka == "") {
      alert('Niste uneli sve podatke!');
      return;
    }

    if (!this.pwValid) {
      alert('Nova lozinka mora imati 8-12 karaktera, poceti slovom, imati bar jedno veliko slovo, jedan broj i jedan specijalan znak.');
      return;
    }

    let userRaw = localStorage.getItem('ulogovan');
    let user = userRaw ? JSON.parse(userRaw) : null;

    if (!user) {
      alert('Niste prijavljeni!');
      return;
    }

    this.userService.promeniLozinku(user.korisnickoIme, this.staraLozinka, this.novaLozinka).subscribe(data => {
      alert(data.msg);
    });
  }

}

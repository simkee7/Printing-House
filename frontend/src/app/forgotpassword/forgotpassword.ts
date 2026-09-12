import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user';

@Component({
  selector: 'app-forgotpassword',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class ForgotpasswordComponent {

  private userService = inject(UserService);

  identifikator: string = "";
  link: string = "";

  posalji() {
    if (this.identifikator == "") {
      alert('Unesite korisnicko ime ili e-mejl adresu!');
      this.link = "";
      return;
    }

    this.userService.zaboravljenaLozinka(this.identifikator).subscribe(data => {
      alert(data.msg);
      this.link = data.link || "";
    });
  }

}

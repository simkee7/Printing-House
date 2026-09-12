import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user';

@Component({
  selector: 'app-resetpassword',
  imports: [FormsModule, RouterLink],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class ResetpasswordComponent {

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string = "";
  novaLozinka: string = "";
  pwRegex = /^(?=.{8,12}$)(?=[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  pwValid: boolean = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
  }

  onPasswordInput() {
    this.pwValid = this.pwRegex.test(this.novaLozinka);
  }

  postaviLozinku() {
    this.onPasswordInput();

    if (!this.pwValid) {
      alert('Lozinka mora imati 8-12 karaktera, poceti slovom, imati bar jedno veliko slovo, jedan broj i jedan specijalan znak.');
      return;
    }

    this.userService.resetujLozinku(this.token, this.novaLozinka).subscribe(data => {
      alert(data.msg);
    });
  }

}

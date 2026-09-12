import { Component, inject } from '@angular/core';
import User from '../models/user';
import { UserService } from '../services/user';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  private userService = inject(UserService);
  user: User = new User();

  slikaDataUrl: string | null = null;
  pwRegex = /^(?=.{8,12}$)(?=[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  pwValid: boolean = false;
  MBRegex = /^\d{8}$/;
  PIBRegex = /^[1-9]\d{8}$/;

  register(){
    this.onPasswordInput();

    if (!this.pwValid) {
      alert('Lozinka nije u trazenom formatu');
      return;
    }

    if (this.user.tip === 'pravno lice' || this.user.tip === 'stamparija') {
      if (!this.MBRegex.test(this.user.MB)) {
        alert('Maticni broj mora imati tacno 8 cifara');
        return;
      }
      if (!this.PIBRegex.test(this.user.PIB)) {
        alert('PIB mora imati 9 cifara i ne sme pocinjati nulom');
        return;
      }
    }

    if (this.slikaDataUrl) {
      this.user.slika = this.slikaDataUrl;
    } else {
      this.user.slika = "default_profile_image.jpg";
    }

    this.userService.register(this.user).subscribe(data => {
      alert(data.msg);
    });
  }

  onPasswordInput() {
    let pw = this.user.lozinka || '';
    this.pwValid = this.pwRegex.test(pw);
  }


  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(f.type)) {
      alert('Dozvoljeni su JPG/PNG/GIF.');
      this.slikaDataUrl = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const w = img.width, h = img.height;
        if (w < 100 || h < 100 || w > 250 || h > 250) {
          alert(`Slika mora biti minimalno 100x100px, a maksimalno 250x250px (trenutno ${w}x${h}px).`);
          this.slikaDataUrl = null;
        } else {
          this.slikaDataUrl = reader.result as string;
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  }

}

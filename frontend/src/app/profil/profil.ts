import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import User from '../models/user';
import { UserService } from '../services/user';
import Narudzbina from '../models/narudzbina';
import { NarudzbinaService } from '../services/narudzbina';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, DatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent {

  private userService = inject(UserService);
  private narudzbinaService = inject(NarudzbinaService);

  user: User = new User();

  slikaDataUrl: string | null = null;
  MBRegex = /^\d{8}$/;
  PIBRegex = /^[1-9]\d{8}$/;

  narudzbine: Narudzbina[] = [];
  poljeSort: string = "datumNarucivanja";
  smerSort: string = "desc";

  gradoviStamparija = new Map<string, string>();

  ngOnInit(): void {
    let userRaw = localStorage.getItem('ulogovan');
    let ulogovan = userRaw ? JSON.parse(userRaw) : null;

    if (!ulogovan) return;

    this.userService.getUser(ulogovan.korisnickoIme).subscribe(data => {
      this.user = data;
    });

    this.ucitajNarudzbine(ulogovan.korisnickoIme);
  }

  ucitajNarudzbine(korisnickoIme: string) {
    this.narudzbinaService.mojeNarudzbine(korisnickoIme).subscribe(data => {
      this.narudzbine = data;

      let naziviStamparija = new Set(data.map((n: any) => n.nazivStamparije));
      naziviStamparija.forEach(naziv => {
        if (naziv && !this.gradoviStamparija.has(naziv)) {
          this.userService.getStamparija(naziv).subscribe(adresa => {
            let delovi = (adresa || '').split(',');
            this.gradoviStamparija.set(naziv, delovi[delovi.length - 1].trim());
          });
        }
      });
    });
  }

  grad(nazivStamparije: string): string {
    return this.gradoviStamparija.get(nazivStamparije) || '';
  }

  slikaPrikaz(): string {
    if (this.slikaDataUrl) return this.slikaDataUrl;
    if (!this.user.slika) return '';
    if (this.user.slika.startsWith('data:')) return this.user.slika;
    return `http://localhost:4000/uploads/profile_pics/${this.user.slika}`;
  }

  azuriraj() {
    if (this.user.tip === 'pravno lice') {
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
    }

    this.userService.azurirajProfil(this.user).subscribe((data: any) => {
      if (data && data.msg && !data.korisnickoIme) {
        alert(data.msg);
      } else {
        this.user = data;
        this.slikaDataUrl = null;
        alert('Podaci su uspesno azurirani.');
        localStorage.setItem('ulogovan', JSON.stringify(data));
      }
    });
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

  sortiraj(polje: string) {
    if (this.poljeSort === polje) {
      this.smerSort = this.smerSort === 'asc' ? 'desc' : 'asc';
    } else {
      this.poljeSort = polje;
      this.smerSort = 'asc';
    }

    this.narudzbine.sort((a: any, b: any) => {
      let va = a[polje];
      let vb = b[polje];
      let rez = 0;
      if (va < vb) rez = -1;
      if (va > vb) rez = 1;
      return this.smerSort === 'asc' ? rez : -rez;
    });
  }

  stavkeTekst(n: Narudzbina): string {
    return n.stavke.map((s, i) => `${i + 1}. ${s.naziv} (${s.kolicina})`).join(', ');
  }

  otkazi(n: Narudzbina) {
    this.narudzbinaService.otkazi(n._id).subscribe(data => {
      alert(data.msg);

      let userRaw = localStorage.getItem('ulogovan');
      let ulogovan = userRaw ? JSON.parse(userRaw) : null;
      if (ulogovan) this.ucitajNarudzbine(ulogovan.korisnickoIme);
    });
  }

}

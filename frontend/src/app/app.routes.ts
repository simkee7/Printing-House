import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin';
import { adminGuard } from './guard/admin-guard';
import { pravnoLiceGuard } from './guard/pravno-lice-guard';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ChangepasswordComponent } from './changepassword/changepassword';
import { LogoutComponent } from './logout/logout';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword';
import { ResetpasswordComponent } from './resetpassword/resetpassword';
import { KlijentComponent } from './klijent/klijent';
import { StamparijaComponent } from './stamparija/stamparija';
import { PocetnaComponent } from './pocetna/pocetna';
import { ProizvodDetaljiComponent } from './proizvod-detalji/proizvod-detalji';
import { ProfilComponent } from './profil/profil';
import { KlijentPretragaComponent } from './klijent-pretraga/klijent-pretraga';
import { KlijentProizvodDetaljiComponent } from './klijent-proizvod-detalji/klijent-proizvod-detalji';
import { PripremaComponent } from './priprema/priprema';
import { EkorpaComponent } from './ekorpa/ekorpa';
import { ArhivaProizvodaComponent } from './arhiva-proizvoda/arhiva-proizvoda';
import { JavneNabavkeComponent } from './javne-nabavke/javne-nabavke';
import { StamparijaNabavkeComponent } from './stamparija-nabavke/stamparija-nabavke';
import { ProfilStamparijaComponent } from './profil-stamparija/profil-stamparija';
import { StamparijaNarudzbineComponent } from './stamparija-narudzbine/stamparija-narudzbine';
import { StamparijaProizvodiComponent } from './stamparija-proizvodi/stamparija-proizvodi';
import { DodavanjeIzFajlaComponent } from './dodavanje-iz-fajla/dodavanje-iz-fajla';
import { StamparijaIzvestavanjeComponent } from './stamparija-izvestavanje/stamparija-izvestavanje';
import { AdminKorisniciComponent } from './admin-korisnici/admin-korisnici';
import { AdminKategorijeComponent } from './admin-kategorije/admin-kategorije';
import { AdminStatistikaComponent } from './admin-statistika/admin-statistika';

export const routes: Routes = [
    {path: "admin", component: AdminComponent, canActivate: [adminGuard]},
    {path: "", component: PocetnaComponent},
    {path: "proizvod/:id", component: ProizvodDetaljiComponent},
    {path: "admin/login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "promeniLozinku", component: ChangepasswordComponent},
    {path: "logout", component: LogoutComponent},
    {path: "zaboravljenaLozinka", component: ForgotpasswordComponent},
    {path: "resetujLozinku/:token", component: ResetpasswordComponent},
    {path: "klijent", component: KlijentComponent},
    {path: "stamparija", component: StamparijaComponent},
    {path: "profil", component: ProfilComponent},
    {path: "klijent/pretraga", component: KlijentPretragaComponent},
    {path: "klijent/proizvod/:id", component: KlijentProizvodDetaljiComponent},
    {path: "priprema", component: PripremaComponent},
    {path: "ekorpa", component: EkorpaComponent},
    {path: "arhiva", component: ArhivaProizvodaComponent},
    {path: "nabavke", component: JavneNabavkeComponent, canActivate: [pravnoLiceGuard]},
    {path: "stamparija/nabavke", component: StamparijaNabavkeComponent},
    {path: "stamparija/profil", component: ProfilStamparijaComponent},
    {path: "stamparija/narudzbine", component: StamparijaNarudzbineComponent},
    {path: "stamparija/proizvodi", component: StamparijaProizvodiComponent},
    {path: "stamparija/dodavanjeIzFajla", component: DodavanjeIzFajlaComponent},
    {path: "stamparija/izvestavanje", component: StamparijaIzvestavanjeComponent},
    {path: "admin/korisnici", component: AdminKorisniciComponent, canActivate: [adminGuard]},
    {path: "admin/kategorije", component: AdminKategorijeComponent, canActivate: [adminGuard]},
    {path: "admin/statistika", component: AdminStatistikaComponent, canActivate: [adminGuard]},
];

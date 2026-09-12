export default class Proizvod {
    _id: string = "";
    sifra: string = "";
    naziv: string = "";
    opis: string = "";
    kategorija: string = "";
    potkategorija: string = "";
    jedinicnaCena: number = 0;
    dostupneBoje: string[] = [];
    slikaUrl: string = "";
    dodatneSlike: string[] = [];
    uslugeStampe: any[] = [];
    kolicinaNaLageru: number = 0;
    stamparijaKorisnickoIme: string = "";
    nazivStamparije: string = "";
    grad: string = "";
    adresaStamparije: string = "";
    brojSvidjanja: number = 0;
    brojNesvidjanja: number = 0;
}

export class StavkaNabavke {
    naziv: string = "";
    kategorija: string = "";
    kolicina: number = 0;
    orijentacionaCenaPoKomadu: number = 0;
}

export default class Nabavka {
    _id: string = "";
    stavke: StavkaNabavke[] = [];
    rokZaPonude: string = "";
    status: string = "";
    pobednikKorisnickoIme: string = "";
    ponude: any[] = [];
    brojPonuda: number = 0;
}

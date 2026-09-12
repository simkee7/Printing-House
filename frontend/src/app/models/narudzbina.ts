export class StavkaNarudzbine {
    naziv: string = "";
    kolicina: number = 0;
    tipStampe: string = "";
    cenaPoKomadu: number = 0;
}

export default class Narudzbina {
    _id: string = "";
    nazivStamparije: string = "";
    stavke: StavkaNarudzbine[] = [];
    ukupanIznos: number = 0;
    status: string = "";
    datumNarucivanja: string = "";
}

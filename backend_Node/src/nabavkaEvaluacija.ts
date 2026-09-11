import Nabavka from './models/nabavka';
import Proizvod from './models/proizvod';
import Narudzbina from './models/narudzbina';

function escapeRegExp(tekst: string): string {
    return tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function imaDovoljnoNaStanju(stamparijaKorisnickoIme: string, stavke: any[]): Promise<boolean> {
    for (let s of stavke) {
        let proizvod: any = await Proizvod.findOne({
            stamparijaKorisnickoIme: stamparijaKorisnickoIme,
            naziv: new RegExp('^' + escapeRegExp(s.naziv) + '$', 'i')
        });

        if (!proizvod || proizvod.kolicinaNaLageru < s.kolicina) {
            return false;
        }
    }
    return true;
}

function rasporediCenu(stavke: any[], cenaUkupno: number): any[] {
    let ukupnaTezina = stavke.reduce((zbir, s) => zbir + s.kolicina * (s.orijentacionaCenaPoKomadu || 0), 0);

    return stavke.map(s => {
        let tezina = s.kolicina * (s.orijentacionaCenaPoKomadu || 0);
        let udeo = ukupnaTezina > 0 ? tezina / ukupnaTezina : (1 / stavke.length);
        let cenaZaStavku = cenaUkupno * udeo;

        return {
            naziv: s.naziv,
            kolicina: s.kolicina,
            tipStampe: s.kategorija,
            cenaPoKomadu: s.kolicina > 0 ? cenaZaStavku / s.kolicina : cenaZaStavku
        };
    });
}

export async function zakljuciNabavkeZaKlijenta(klijentKorisnickoIme: string): Promise<void> {
    let nabavke = await Nabavka.find({ klijentKorisnickoIme: klijentKorisnickoIme, status: { $ne: 'zavrsena' } });

    for (let n of nabavke as any[]) {
        if (n.status === 'otvorena' && n.rokZaPonude < new Date()) {
            n.status = 'zatvorena';
            await n.save();
        }

        if (n.status !== 'zatvorena') continue;

        let ponudePoCeni = [...n.ponude].sort((a: any, b: any) => a.cenaUkupno - b.cenaUkupno);

        let pobednickaPonuda: any = null;
        for (let p of ponudePoCeni) {
            if (await imaDovoljnoNaStanju(p.stamparijaKorisnickoIme, n.stavke)) {
                pobednickaPonuda = p;
                break;
            }
        }

        n.status = 'zavrsena';

        if (!pobednickaPonuda) {
            await n.save();
            continue;
        }

        n.pobednikKorisnickoIme = pobednickaPonuda.stamparijaKorisnickoIme;
        await n.save();

        try {
            let stavkeZaFakturu = rasporediCenu(n.stavke, pobednickaPonuda.cenaUkupno);

            let novaNarudzbina = new Narudzbina({
                klijentKorisnickoIme: n.klijentKorisnickoIme,
                stamparijaKorisnickoIme: pobednickaPonuda.stamparijaKorisnickoIme,
                stavke: stavkeZaFakturu,
                ukupanIznos: pobednickaPonuda.cenaUkupno,
                status: 'u stampi'
            });

            await novaNarudzbina.save();

            for (let s of n.stavke) {
                await Proizvod.findOneAndUpdate(
                    {
                        stamparijaKorisnickoIme: pobednickaPonuda.stamparijaKorisnickoIme,
                        naziv: new RegExp('^' + escapeRegExp(s.naziv) + '$', 'i')
                    },
                    { $inc: { kolicinaNaLageru: -s.kolicina } }
                );
            }
        } catch (err) {
            console.log('Greska pri kreiranju narudzbine za pobednicku ponudu javne nabavke:', err);
        }
    }
}

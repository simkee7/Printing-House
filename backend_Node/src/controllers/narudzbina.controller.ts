import * as express from 'express';
import Narudzbina from '../models/narudzbina';
import Proizvod from '../models/proizvod';
import User from '../models/user';
import { posaljiFakturuMejlom } from '../mailer';
const PDFDocument = require('pdfkit');

export class NarudzbinaController {

    // sve narudzbine (fakture) jednog klijenta - i prethodno realizovane i trenutno aktuelne
    mojeNarudzbine = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Narudzbina.find({ klijentKorisnickoIme: korisnickoIme }).sort({ datumNarucivanja: -1 }).then(async narudzbine => {
            // ubacujemo i naziv stamparije uz svaku fakturu (radi prikaza u tabeli)
            let stamparije = await User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije');
            let mapa = new Map<string, string>();
            stamparije.forEach((s: any) => mapa.set(s.korisnickoIme, s.nazivInstitucije));

            let rezultat = narudzbine.map((n: any) => ({
                _id: n._id,
                nazivStamparije: mapa.get(n.stamparijaKorisnickoIme) || n.stamparijaKorisnickoIme,
                stavke: n.stavke,
                ukupanIznos: n.ukupanIznos,
                status: n.status,
                datumNarucivanja: n.datumNarucivanja
            }));

            res.json(rezultat);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    // otkazivanje narudzbine - dozvoljeno samo dok je status "placeno" (stampa jos nije zapoceta).
    // Narudzbina se kreira odmah sa statusom "placeno" (nema vise posebnog koraka placanja), tako
    // da je to sada prvi status u kome se otkazivanje uopste ima smisla.
    otkazi = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        Narudzbina.findById(id).then(n => {
            if (!n) {
                res.json({ msg: 'Narudzbina ne postoji.' });
                return;
            }

            if (n.status !== 'placeno') {
                res.json({ msg: 'Narudzbina se vise ne moze otkazati (stampa je vec zapoceta ili je vec zavrsena).' });
                return;
            }

            Narudzbina.deleteOne({ _id: id }).then(() => {
                res.json({ msg: 'Narudzbina je otkazana.' });
            }).catch(err => {
                console.log(err);
                res.json({ msg: 'Greska pri otkazivanju narudzbine!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri otkazivanju narudzbine!' });
        });
    }

    // potvrda e-korpe (dugme "POTVRDI") - grupise stavke po stamparijama i pravi po jednu narudzbinu (fakturu)
    // za svaku stamparija, uz proveru da ima dovoljno svakog proizvoda na stanju. Narudzbina se
    // odmah kreira sa statusom "placeno" (nema posebnog koraka unosa kartice) i faktura se odmah
    // salje na mejl. Dozvoljeno je samo klijentima tipa "fizicko lice" - klijent tipa "pravno lice"
    // ide na javnu nabavku (NabavkaController.kreirajIzKorpe), provera mora da postoji i ovde jer se
    // do ove rute moze doci direktnim pozivom, mimo veb strane (na frontendu se to grana kroz ekorpa.ts).
    kreiraj = (req: express.Request, res: express.Response) => {
        let klijentKorisnickoIme = req.body.klijentKorisnickoIme;
        let stavke = req.body.stavke || [];

        if (stavke.length === 0) {
            res.json({ msg: 'Korpa je prazna.' });
            return;
        }

        User.findOne({ korisnickoIme: klijentKorisnickoIme }).then(korisnik => {
            if (korisnik && korisnik.tip === 'pravno lice') {
                res.json({ msg: 'Klijenti tipa pravno lice narucuju kroz javnu nabavku, ne kroz redovnu e-korpu.' });
                return;
            }

            this.kreirajNarudzbinu(klijentKorisnickoIme, stavke, res);
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri proveri korisnika!' });
        });
    }

    // izdvojeno iz kreiraj() - stvarno kreiranje narudzbine(a)
    private kreirajNarudzbinu = (klijentKorisnickoIme: string, stavke: any[], res: express.Response) => {
        Promise.all(stavke.map((s: any) => s.sifra ? Proizvod.findOne({ sifra: s.sifra }) : Promise.resolve(null))).then(proizvodi => {
            for (let i = 0; i < stavke.length; i++) {
                let p: any = proizvodi[i];
                if (p && p.kolicinaNaLageru < stavke[i].kolicina) {
                    res.json({ msg: `Nema dovoljno proizvoda trenutno na stanju (${stavke[i].naziv}).` });
                    return;
                }
            }

            // grupisanje stavki po stamparijama - jedna stamparija = jedna faktura
            let grupe = new Map<string, any[]>();
            stavke.forEach((s: any) => {
                let lista = grupe.get(s.stamparijaKorisnickoIme) || [];
                lista.push(s);
                grupe.set(s.stamparijaKorisnickoIme, lista);
            });

            let noveNarudzbine: any[] = [];
            grupe.forEach((lista, stamparijaKorisnickoIme) => {
                let ukupanIznos = lista.reduce((zbir, s) => zbir + s.kolicina * s.cenaPoKomadu, 0);
                noveNarudzbine.push({
                    klijentKorisnickoIme: klijentKorisnickoIme,
                    stamparijaKorisnickoIme: stamparijaKorisnickoIme,
                    stavke: lista.map(s => ({
                        sifra: s.sifra,
                        naziv: s.naziv,
                        kolicina: s.kolicina,
                        tipStampe: s.tipStampe,
                        cenaPoKomadu: s.cenaPoKomadu
                    })),
                    ukupanIznos: ukupanIznos,
                    // nema vise posebnog koraka placanja - narudzbina se odmah smatra placenom i
                    // faktura se odmah generise/salje na mejl (ispod)
                    status: 'placeno'
                });
            });

            Narudzbina.insertMany(noveNarudzbine).then(sacuvane => {
                // umanjujemo kolicinu na stanju za svaki naruceni proizvod
                let umanjenja = stavke
                    .filter((s: any) => s.sifra)
                    .map((s: any) => Proizvod.findOneAndUpdate({ sifra: s.sifra }, { $inc: { kolicinaNaLageru: -s.kolicina } }));

                Promise.all(umanjenja).then(() => {
                    res.json({
                        msg: 'Narudzbina je uspesno kreirana. Faktura je poslata na Vasu e-mejl adresu.',
                        narudzbine: sacuvane.map((n: any) => ({
                            _id: n._id,
                            stamparijaKorisnickoIme: n.stamparijaKorisnickoIme,
                            ukupanIznos: n.ukupanIznos
                        }))
                    });

                    // Slanje fakture(a) na mejl klijenta - radi se u pozadini (posle odgovora korisniku),
                    // tako da eventualno sporo slanje mejla ne usporava kreiranje narudzbine.
                    User.findOne({ korisnickoIme: klijentKorisnickoIme }).then(async (klijent: any) => {
                        if (!klijent || !klijent.email) return;

                        for (let n of sacuvane as any[]) {
                            try {
                                let stamparija: any = await User.findOne({ korisnickoIme: n.stamparijaKorisnickoIme });
                                let pdfBuffer = await this.generisiFakturuBuffer(n, stamparija, klijent);
                                await posaljiFakturuMejlom(klijent.email, `${klijent.ime} ${klijent.prezime}`, String(n._id), pdfBuffer);
                            } catch (err) {
                                console.log('Greska pri slanju fakture mejlom:', err);
                            }
                        }
                    }).catch((err: any) => console.log('Greska pri dohvatanju klijenta za slanje mejla:', err));
                });
            }).catch(err => {
                console.log(err);
                res.json({ msg: 'Greska pri kreiranju narudzbine!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri proveri stanja na lageru!' });
        });
    }

    // Arhiva proizvoda - narudzbine koje su vec isporucene ili primljene. Za primljene narudzbine
    // se uz svaku stavku vracaju i podaci potrebni za ocenjivanje/komentarisanje (samo ako stavka
    // ima sifru, tj. moze da se spoji sa stvarnim proizvodom u bazi preko te sifre).
    arhiva = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Narudzbina.find({ klijentKorisnickoIme: korisnickoIme, status: { $in: ['isporuceno', 'primljeno'] } })
            .sort({ datumNarucivanja: -1 })
            .then(async (narudzbine: any[]) => {
                let stamparije = await User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije');
                let mapaStamparija = new Map<string, string>();
                stamparije.forEach((s: any) => mapaStamparija.set(s.korisnickoIme, s.nazivInstitucije));

                let sifreProizvoda: string[] = [];
                narudzbine.forEach((n: any) => {
                    if (n.status === 'primljeno') {
                        n.stavke.forEach((s: any) => { if (s.sifra) sifreProizvoda.push(s.sifra); });
                    }
                });

                let proizvodi = await Proizvod.find({ sifra: { $in: sifreProizvoda } });
                let mapaProizvoda = new Map<string, any>();
                proizvodi.forEach((p: any) => mapaProizvoda.set(p.sifra, p));

                let rezultat = narudzbine.map((n: any) => ({
                    _id: n._id,
                    nazivStamparije: mapaStamparija.get(n.stamparijaKorisnickoIme) || n.stamparijaKorisnickoIme,
                    status: n.status,
                    datumNarucivanja: n.datumNarucivanja,
                    stavke: n.stavke.map((s: any) => {
                        let osnovno: any = {
                            sifra: s.sifra,
                            naziv: s.naziv,
                            kolicina: s.kolicina,
                            tipStampe: s.tipStampe,
                            cenaPoKomadu: s.cenaPoKomadu
                        };

                        if (n.status === 'primljeno' && s.sifra) {
                            let p = mapaProizvoda.get(s.sifra);
                            if (p) {
                                osnovno.brojSvidjanja = (p.svidjanja || []).length;
                                osnovno.brojNesvidjanja = (p.nesvidjanja || []).length;
                                osnovno.daLiSamSvideo = (p.svidjanja || []).some((s: any) => s.korisnickoIme === korisnickoIme);
                                osnovno.daLiSamNesvideo = (p.nesvidjanja || []).some((s: any) => s.korisnickoIme === korisnickoIme);
                                let mojKomentar = (p.komentari || []).find((k: any) => k.korisnickoIme === korisnickoIme);
                                osnovno.mojKomentar = mojKomentar ? mojKomentar.tekst : '';
                            }
                        }

                        return osnovno;
                    })
                }));

                res.json(rezultat);
            }).catch(err => {
                console.log(err);
                res.json([]);
            });
    }

    // Klijent potvrdjuje prijem narudzbine (dugme "Potvrdi prijem" u Arhivi proizvoda) - tek nakon ovoga
    // proizvodi iz te narudzbine postaju dostupni za ocenjivanje i komentarisanje
    potvrdiPrijem = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        Narudzbina.findById(id).then((n: any) => {
            if (!n) {
                res.json({ msg: 'Narudzbina ne postoji.' });
                return;
            }

            if (n.status !== 'isporuceno') {
                res.json({ msg: 'Narudzbina jos nije isporucena.' });
                return;
            }

            n.status = 'primljeno';
            n.save().then(() => {
                res.json({ msg: 'Prijem je potvrdjen. Sada mozete da ocenite i komentarisete proizvode.' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri potvrdi prijema!' });
        });
    }

    // sve narudzbine (posao za odraditi) jedne stamparije
    zaStampariju = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Narudzbina.find({ stamparijaKorisnickoIme: korisnickoIme }).sort({ datumNarucivanja: -1 }).then((narudzbine: any[]) => {
            res.json(narudzbine.map((n: any) => ({
                _id: n._id,
                klijentKorisnickoIme: n.klijentKorisnickoIme,
                stavke: n.stavke,
                ukupanIznos: n.ukupanIznos,
                status: n.status,
                datumNarucivanja: n.datumNarucivanja
            })));
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    // stamparija pomera narudzbinu na sledeci korak u obradi: placeno -> u stampi -> isporuceno.
    // Narudzbina se kreira odmah sa statusom "placeno" (nema vise posebnog koraka placanja), a
    // isporuceno -> primljeno potvrdjuje klijent.
    sledeciKorak = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        let redosled: any = { 'placeno': 'u stampi', 'u stampi': 'isporuceno' };

        Narudzbina.findById(id).then((n: any) => {
            if (!n) {
                res.json({ msg: 'Narudzbina ne postoji.' });
                return;
            }

            let sledeci = redosled[n.status];
            if (!sledeci) {
                res.json({ msg: 'Narudzbina se vise ne moze pomeriti u sledeci status.' });
                return;
            }

            n.status = sledeci;
            n.save().then(() => {
                res.json({ msg: `Status je promenjen u "${sledeci}".` });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri promeni statusa!' });
        });
    }

    // Izvestavanje - osnovna statistika za jednu stampariju: broj narudzbina po statusu, ukupan prihod
    // (samo od narudzbina koje su bar placene, "naruceno" se ne racuna) i najtrazeniji proizvodi po kolicini
    izvestaj = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Narudzbina.find({ stamparijaKorisnickoIme: korisnickoIme }).then((narudzbine: any[]) => {
            let brojPoStatusu: any = { naruceno: 0, placeno: 0, 'u stampi': 0, isporuceno: 0, primljeno: 0 };
            let ukupanPrihod = 0;
            let prodajaPoProizvodu = new Map<string, any>();

            narudzbine.forEach((n: any) => {
                brojPoStatusu[n.status] = (brojPoStatusu[n.status] || 0) + 1;

                if (n.status !== 'naruceno') {
                    ukupanPrihod += n.ukupanIznos;

                    n.stavke.forEach((s: any) => {
                        let unos = prodajaPoProizvodu.get(s.naziv) || { naziv: s.naziv, kolicina: 0, prihod: 0 };
                        unos.kolicina += s.kolicina;
                        unos.prihod += s.kolicina * s.cenaPoKomadu;
                        prodajaPoProizvodu.set(s.naziv, unos);
                    });
                }
            });

            let najtrazeniji = Array.from(prodajaPoProizvodu.values())
                .sort((a: any, b: any) => b.kolicina - a.kolicina)
                .slice(0, 10);

            Proizvod.find({ stamparijaKorisnickoIme: korisnickoIme }).then((proizvodi: any[]) => {
                res.json({
                    ukupanBrojNarudzbina: narudzbine.length,
                    brojNarudzbinaPoStatusu: brojPoStatusu,
                    ukupanPrihod: ukupanPrihod,
                    najtrazeniji: najtrazeniji,
                    brojProizvoda: proizvodi.length,
                    brojRasprodatihProizvoda: proizvodi.filter((p: any) => p.kolicinaNaLageru === 0).length
                });
            }).catch(err => {
                console.log(err);
                res.json({ ukupanBrojNarudzbina: 0, brojNarudzbinaPoStatusu: {}, ukupanPrihod: 0, najtrazeniji: [], brojProizvoda: 0, brojRasprodatihProizvoda: 0 });
            });
        }).catch(err => {
            console.log(err);
            res.json({ ukupanBrojNarudzbina: 0, brojNarudzbinaPoStatusu: {}, ukupanPrihod: 0, najtrazeniji: [], brojProizvoda: 0, brojRasprodatihProizvoda: 0 });
        });
    }

    // generisanje PDF fakture za jednu narudzbinu, u obliku Buffer-a - koristi se i za
    // preuzimanje sa veb strane (faktura()), i za slanje u prilogu mejla (kreiraj())
    private generisiFakturuBuffer = (n: any, stamparija: any, klijent: any): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            let doc = new PDFDocument();
            let delovi: Buffer[] = [];

            doc.on('data', (deo: Buffer) => delovi.push(deo));
            doc.on('end', () => resolve(Buffer.concat(delovi)));
            doc.on('error', (err: any) => reject(err));

            doc.fontSize(18).text('Faktura', { align: 'center' });
            doc.moveDown();
            doc.fontSize(11);
            doc.text(`Broj fakture: ${n._id}`);
            doc.text(`Datum narucivanja: ${new Date(n.datumNarucivanja).toLocaleString('sr-RS')}`);
            doc.text(`Stamparija: ${stamparija ? stamparija.nazivInstitucije : n.stamparijaKorisnickoIme}`);
            doc.text(`Klijent: ${klijent ? (klijent.ime + ' ' + klijent.prezime) : n.klijentKorisnickoIme}`);
            doc.text(`Status: ${n.status}`);
            doc.moveDown();

            doc.text('Stavke:', { underline: true });
            n.stavke.forEach((s: any) => {
                doc.text(`- ${s.naziv} ${s.tipStampe ? '(' + s.tipStampe + ')' : ''} x ${s.kolicina} = ${s.kolicina * s.cenaPoKomadu} din`);
            });

            doc.moveDown();
            doc.fontSize(13).text(`Ukupan iznos: ${n.ukupanIznos} din`, { align: 'right' });

            doc.end();
        });
    }

    // preuzimanje PDF fakture za jednu narudzbinu sa veb strane
    faktura = (req: express.Request, res: express.Response) => {
        let id = req.params.id;

        Narudzbina.findById(id).then(async (n: any) => {
            if (!n) {
                res.status(404).send('Narudzbina ne postoji.');
                return;
            }

            let stamparija: any = await User.findOne({ korisnickoIme: n.stamparijaKorisnickoIme });
            let klijent: any = await User.findOne({ korisnickoIme: n.klijentKorisnickoIme });

            let pdfBuffer = await this.generisiFakturuBuffer(n, stamparija, klijent);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=faktura_${n._id}.pdf`);
            res.send(pdfBuffer);
        }).catch(err => {
            console.log(err);
            res.status(500).send('Greska pri generisanju fakture.');
        });
    }
}

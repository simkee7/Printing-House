import * as express from 'express';
import Nabavka from '../models/nabavka';
import User from '../models/user';
import { posaljiObavestenjeONabavci } from '../mailer';
const PDFDocument = require('pdfkit');
const TRAJANJE_LICITACIJE_MS = 10 * 60 * 1000;

export class NabavkaController {

    private zatvoriAkoJeIstekaoRok = async (n: any) => {
        if (n.status === 'otvorena' && n.rokZaPonude < new Date()) {
            n.status = 'zatvorena';
            await n.save();
        }
        return n;
    }

    kreirajIzKorpe = (req: express.Request, res: express.Response) => {
        let klijentKorisnickoIme = req.body.klijentKorisnickoIme;
        let stavke = req.body.stavke || [];

        if (stavke.length === 0) {
            res.json({ msg: 'Korpa je prazna.' });
            return;
        }

        User.findOne({ korisnickoIme: klijentKorisnickoIme }).then(korisnik => {
            if (!korisnik || korisnik.tip !== 'pravno lice') {
                res.json({ msg: 'Javne nabavke mogu da kreiraju samo korisnici tipa pravno lice.' });
                return;
            }

            let rokZaPonude = new Date(Date.now() + TRAJANJE_LICITACIJE_MS);

            let nova = new Nabavka({
                klijentKorisnickoIme: klijentKorisnickoIme,
                stavke: stavke.map((s: any) => ({
                    naziv: s.naziv,
                    kategorija: s.kategorija,
                    kolicina: s.kolicina,
                    orijentacionaCenaPoKomadu: s.cenaPoKomadu
                })),
                rokZaPonude: rokZaPonude
            });

            nova.save().then(async (sacuvana: any) => {
                res.json({ msg: 'Zahtev za javnu nabavku je uspesno kreiran i prosledjen stamparijama. Licitacija traje 10 minuta.', nabavka: sacuvana });

                try {
                    let stamparije = await User.find({ tip: 'stamparija' });
                    for (let s of stamparije as any[]) {
                        if (s.email) {
                            await posaljiObavestenjeONabavci(s.email, sacuvana.stavke, sacuvana.rokZaPonude);
                        }
                    }
                } catch (err) {
                    console.log('Greska pri slanju obavestenja stamparijama o novoj javnoj nabavci:', err);
                }
            }).catch(err => {
                console.log(err);
                res.json({ msg: 'Greska pri kreiranju javne nabavke!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri kreiranju javne nabavke!' });
        });
    }

    moje = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Nabavka.find({ klijentKorisnickoIme: korisnickoIme }).sort({ datumKreiranja: -1 }).then(async (nabavke: any[]) => {
            let azurirane: any[] = [];
            for (let n of nabavke) {
                azurirane.push(await this.zatvoriAkoJeIstekaoRok(n));
            }

            let rezultat = azurirane.map((n: any) => ({
                _id: n._id,
                stavke: n.stavke,
                rokZaPonude: n.rokZaPonude,
                status: n.status,
                pobednikKorisnickoIme: n.pobednikKorisnickoIme,
                brojPonuda: n.ponude.length
            }));

            res.json(rezultat);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    otvorene = (req: express.Request, res: express.Response) => {
        Nabavka.find({ status: { $ne: 'zavrsena' } }).then(async (nabavke: any[]) => {
            let azurirane: any[] = [];
            for (let n of nabavke) {
                azurirane.push(await this.zatvoriAkoJeIstekaoRok(n));
            }

            let samoOtvorene = azurirane.filter((n: any) => n.status === 'otvorena');

            res.json(samoOtvorene.map((n: any) => ({
                _id: n._id,
                stavke: n.stavke,
                rokZaPonude: n.rokZaPonude
            })));
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    mojePonude = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Nabavka.find({ 'ponude.stamparijaKorisnickoIme': korisnickoIme }).sort({ datumKreiranja: -1 }).then(async (nabavke: any[]) => {
            let azurirane: any[] = [];
            for (let n of nabavke) {
                azurirane.push(await this.zatvoriAkoJeIstekaoRok(n));
            }

            res.json(azurirane.map((n: any) => {
                let mojaPonuda = n.ponude.find((p: any) => p.stamparijaKorisnickoIme === korisnickoIme);
                return {
                    _id: n._id,
                    stavke: n.stavke,
                    rokZaPonude: n.rokZaPonude,
                    status: n.status,
                    mojaCenaUkupno: mojaPonuda ? mojaPonuda.cenaUkupno : null,
                    mojRokIsporuke: mojaPonuda ? mojaPonuda.rokIsporukeDana : null,
                    pobednikKorisnickoIme: n.pobednikKorisnickoIme,
                    daLiSamPobednik: n.pobednikKorisnickoIme === korisnickoIme
                };
            }));
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    posaljiPonudu = (req: express.Request, res: express.Response) => {
        let nabavkaId = req.body.nabavkaId;
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
        let cenaUkupno = req.body.cenaUkupno;
        let rokIsporukeDana = req.body.rokIsporukeDana;

        Nabavka.findById(nabavkaId).then(async (n: any) => {
            if (!n) {
                res.json({ msg: 'Nabavka ne postoji.' });
                return;
            }

            n = await this.zatvoriAkoJeIstekaoRok(n);

            if (n.status !== 'otvorena') {
                res.json({ msg: 'Rok za dostavljanje ponuda je istekao.' });
                return;
            }

            let postojeca = n.ponude.find((p: any) => p.stamparijaKorisnickoIme === stamparijaKorisnickoIme);
            if (postojeca) {
                postojeca.cenaUkupno = cenaUkupno;
                postojeca.rokIsporukeDana = rokIsporukeDana;
                postojeca.datumPonude = new Date();
            } else {
                n.ponude.push({
                    stamparijaKorisnickoIme: stamparijaKorisnickoIme,
                    cenaUkupno: cenaUkupno,
                    rokIsporukeDana: rokIsporukeDana,
                    datumPonude: new Date()
                });
            }

            n.save().then(() => {
                res.json({ msg: 'Ponuda je uspesno poslata.' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri slanju ponude!' });
        });
    }

    detalji = (req: express.Request, res: express.Response) => {
        let id = req.params.id;

        Nabavka.findById(id).then(async (n: any) => {
            if (!n) {
                res.json(null);
                return;
            }

            n = await this.zatvoriAkoJeIstekaoRok(n);

            let stamparije = await User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije');
            let mapa = new Map<string, string>();
            stamparije.forEach((s: any) => mapa.set(s.korisnickoIme, s.nazivInstitucije));

            res.json({
                _id: n._id,
                stavke: n.stavke,
                rokZaPonude: n.rokZaPonude,
                status: n.status,
                pobednikKorisnickoIme: n.pobednikKorisnickoIme,
                ponude: n.status === 'otvorena' ? [] : n.ponude.map((p: any) => ({
                    stamparijaKorisnickoIme: p.stamparijaKorisnickoIme,
                    nazivStamparije: mapa.get(p.stamparijaKorisnickoIme) || p.stamparijaKorisnickoIme,
                    cenaUkupno: p.cenaUkupno,
                    rokIsporukeDana: p.rokIsporukeDana
                }))
            });
        }).catch(err => {
            console.log(err);
            res.json(null);
        });
    }

    izvestaj = (req: express.Request, res: express.Response) => {
        let id = req.params.id;

        Nabavka.findById(id).then(async (n: any) => {
            if (!n) {
                res.status(404).send('Nabavka ne postoji.');
                return;
            }

            n = await this.zatvoriAkoJeIstekaoRok(n);

            if (n.status === 'otvorena') {
                res.status(400).send('Izvestaj jos nije dostupan - rok za ponude nije istekao.');
                return;
            }

            let stamparije = await User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije');
            let mapa = new Map<string, string>();
            stamparije.forEach((s: any) => mapa.set(s.korisnickoIme, s.nazivInstitucije));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=izvestaj_nabavka_${n._id}.pdf`);

            let doc = new PDFDocument();
            doc.pipe(res);

            doc.fontSize(18).text('Izvestaj o javnoj nabavci', { align: 'center' });
            doc.moveDown();
            doc.fontSize(11);
            doc.text(`Rok za dostavljanje ponuda: ${new Date(n.rokZaPonude).toLocaleString('sr-RS')}`);
            doc.text(`Status: ${n.status}`);
            doc.moveDown();

            doc.text('Trazeni proizvodi:', { underline: true });
            n.stavke.forEach((s: any) => {
                doc.text(`- ${s.naziv}${s.kategorija ? ' (' + s.kategorija + ')' : ''} x ${s.kolicina}`);
            });
            doc.moveDown();

            doc.text('Pristigle ponude:', { underline: true });
            if (n.ponude.length === 0) {
                doc.text('Nije pristigla nijedna ponuda.');
            } else {
                n.ponude.forEach((p: any) => {
                    let nazivStamparije = mapa.get(p.stamparijaKorisnickoIme) || p.stamparijaKorisnickoIme;
                    let oznakaPobednika = n.pobednikKorisnickoIme === p.stamparijaKorisnickoIme ? ' [IZABRANI IZVODJAC]' : '';
                    doc.text(`- ${nazivStamparije}: ${p.cenaUkupno} din (ukupno), rok isporuke ${p.rokIsporukeDana} dana${oznakaPobednika}`);
                });
            }

            doc.end();
        }).catch(err => {
            console.log(err);
            res.status(500).send('Greska pri generisanju izvestaja.');
        });
    }
}

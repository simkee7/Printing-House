import * as express from 'express';
import Proizvod from '../models/proizvod';
import User from '../models/user';
const crypto = require('crypto');

export class ProizvodController {
    
    dodaj = (req: express.Request, res: express.Response) => {
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
        let naziv = req.body.naziv;
        let opis = req.body.opis;
        let kategorija = req.body.kategorija;
        let potkategorija = req.body.potkategorija;
        let jedinicnaCena = req.body.jedinicnaCena;
        let kolicinaNaLageru = req.body.kolicinaNaLageru;
        let dostupneBoje = req.body.dostupneBoje;
        let slikaUrl = req.body.slikaUrl;
        let dodatneSlike = req.body.dodatneSlike;
        let uslugeStampe = req.body.uslugeStampe;

        if (!stamparijaKorisnickoIme || !naziv || !kategorija || !potkategorija || jedinicnaCena === undefined || jedinicnaCena === null) {
            res.json({ msg: 'Popunite naziv, kategoriju, potkategoriju i jedinicnu cenu.' });
            return;
        }

        let sifra = 'PR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        let novi = new Proizvod({
            sifra: sifra,
            naziv: naziv,
            opis: opis || '',
            kategorija: kategorija,
            potkategorija: potkategorija,
            jedinicnaCena: jedinicnaCena,
            kolicinaNaLageru: kolicinaNaLageru || 0,
            dostupneBoje: dostupneBoje && dostupneBoje.length > 0 ? dostupneBoje : ['Bela'],
            slikaUrl: slikaUrl || '',
            dodatneSlike: (dodatneSlike || []).slice(0, 3),
            uslugeStampe: uslugeStampe || [],
            stamparijaKorisnickoIme: stamparijaKorisnickoIme
        });

        novi.save().then((sacuvan: any) => {
            res.json({ msg: 'Proizvod je uspesno dodat.', proizvod: sacuvan });
        }).catch((err: any) => {
            console.log(err);
            res.json({ msg: 'Greska pri dodavanju proizvoda!' });
        });
    }

    pocetna = (req: express.Request, res: express.Response) => {
        Promise.all([
            User.countDocuments({ tip: 'stamparija', aktivan: true }),
            Proizvod.find({ kolicinaNaLageru: { $gt: 0 } }),
            User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije adresaSedista')
        ]).then(([brojStamparija, proizvodi, stamparije]) => {
            let mapa = this.napraviMapuStamparija(stamparije);

            let top5 = proizvodi
                .map((p: any) => ({
                    _id: p._id,
                    naziv: p.naziv,
                    nazivStamparije: mapa.get(p.stamparijaKorisnickoIme)?.nazivInstitucije || '',
                    brojSvidjanja: (p.svidjanja || []).length
                }))
                .sort((a: any, b: any) => b.brojSvidjanja - a.brojSvidjanja)
                .slice(0, 5);

            res.json({ brojStamparija, top5 });
        }).catch(err => {
            console.log(err);
            res.json({ brojStamparija: 0, top5: [] });
        });
    }

    kategorije = (req: express.Request, res: express.Response) => {
        Proizvod.distinct('kategorija', { kolicinaNaLageru: { $gt: 0 } }).then(kategorije => {
            res.json(kategorije);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    pretraga = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv;
        let kategorija = req.body.kategorija;

        let uslov: any = { kolicinaNaLageru: { $gt: 0 } };
        if (naziv) uslov.naziv = { $regex: naziv, $options: 'i' };
        if (kategorija && kategorija !== 'Sve kategorije') uslov.kategorija = kategorija;

        Promise.all([
            Proizvod.find(uslov),
            User.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije adresaSedista')
        ]).then(([proizvodi, stamparije]) => {
            let mapa = this.napraviMapuStamparija(stamparije);

            let rezultat = proizvodi.map((p: any) => {
                let s = mapa.get(p.stamparijaKorisnickoIme);
                return {
                    _id: p._id,
                    naziv: p.naziv,
                    kategorija: p.kategorija,
                    potkategorija: p.potkategorija,
                    jedinicnaCena: p.jedinicnaCena,
                    nazivStamparije: s ? s.nazivInstitucije : '',
                    grad: s ? this.izvuciGrad(s.adresaSedista) : ''
                };
            });
            res.json(rezultat);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    detalji = (req: express.Request, res: express.Response) => {
        let id = req.params.id;

        Proizvod.findById(id).then((p: any) => {
            if (!p) {
                res.json(null);
                return;
            }

            User.findOne({ korisnickoIme: p.stamparijaKorisnickoIme }, 'nazivInstitucije adresaSedista').then((s: any) => {
                res.json({
                    _id: p._id,
                    sifra: p.sifra,
                    naziv: p.naziv,
                    opis: p.opis,
                    kategorija: p.kategorija,
                    potkategorija: p.potkategorija,
                    jedinicnaCena: p.jedinicnaCena,
                    dostupneBoje: p.dostupneBoje,
                    slikaUrl: p.slikaUrl,
                    dodatneSlike: p.dodatneSlike,
                    uslugeStampe: p.uslugeStampe,
                    kolicinaNaLageru: p.kolicinaNaLageru,
                    stamparijaKorisnickoIme: p.stamparijaKorisnickoIme,
                    nazivStamparije: s ? s.nazivInstitucije : '',
                    adresaStamparije: s ? s.adresaSedista : '',
                    grad: s ? this.izvuciGrad(s.adresaSedista) : '',
                    brojSvidjanja: (p.svidjanja || []).length,
                    brojNesvidjanja: (p.nesvidjanja || []).length,
                    // poslednjih 5 komentara svih klijenata (najnoviji prvi)
                    poslednjiKomentari: (p.komentari || [])
                        .slice()
                        .sort((a: any, b: any) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
                        .slice(0, 5)
                        .map((k: any) => ({ korisnickoIme: k.korisnickoIme, tekst: k.tekst, datum: k.datum }))
                });
            });
        }).catch(err => {
            console.log(err);
            res.json(null);
        });
    }

    svidi = (req: express.Request, res: express.Response) => {
        let sifra = req.body.sifra;
        let korisnickoIme = req.body.korisnickoIme;

        Proizvod.findOne({ sifra: sifra }).then((p: any) => {
            if (!p) {
                res.json({ msg: 'Proizvod ne postoji.' });
                return;
            }

            let vecPostoji = p.svidjanja.some((s: any) => s.korisnickoIme === korisnickoIme);
            if (!vecPostoji) {
                p.svidjanja.push({ korisnickoIme: korisnickoIme, datum: new Date() });

                let indeksNe = p.nesvidjanja.findIndex((s: any) => s.korisnickoIme === korisnickoIme);
                if (indeksNe >= 0) {
                    p.nesvidjanja.splice(indeksNe, 1);
                }
            }

            p.save().then(() => {
                res.json({
                    brojSvidjanja: p.svidjanja.length,
                    brojNesvidjanja: p.nesvidjanja.length,
                    daLiSamSvideo: p.svidjanja.some((s: any) => s.korisnickoIme === korisnickoIme),
                    daLiSamNesvideo: p.nesvidjanja.some((s: any) => s.korisnickoIme === korisnickoIme)
                });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri svidjanju proizvoda!' });
        });
    }

    nesvidi = (req: express.Request, res: express.Response) => {
        let sifra = req.body.sifra;
        let korisnickoIme = req.body.korisnickoIme;

        Proizvod.findOne({ sifra: sifra }).then((p: any) => {
            if (!p) {
                res.json({ msg: 'Proizvod ne postoji.' });
                return;
            }

            let vecPostoji = p.nesvidjanja.some((s: any) => s.korisnickoIme === korisnickoIme);
            if (!vecPostoji) {
                p.nesvidjanja.push({ korisnickoIme: korisnickoIme, datum: new Date() });

                let indeksDa = p.svidjanja.findIndex((s: any) => s.korisnickoIme === korisnickoIme);
                if (indeksDa >= 0) {
                    p.svidjanja.splice(indeksDa, 1);
                }
            }

            p.save().then(() => {
                res.json({
                    brojSvidjanja: p.svidjanja.length,
                    brojNesvidjanja: p.nesvidjanja.length,
                    daLiSamSvideo: p.svidjanja.some((s: any) => s.korisnickoIme === korisnickoIme),
                    daLiSamNesvideo: p.nesvidjanja.some((s: any) => s.korisnickoIme === korisnickoIme)
                });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri nesvidjanju proizvoda!' });
        });
    }

    komentarisi = (req: express.Request, res: express.Response) => {
        let sifra = req.body.sifra;
        let korisnickoIme = req.body.korisnickoIme;
        let tekst = req.body.tekst;

        Proizvod.findOne({ sifra: sifra }).then((p: any) => {
            if (!p) {
                res.json({ msg: 'Proizvod ne postoji.' });
                return;
            }

            let postojeci = p.komentari.find((k: any) => k.korisnickoIme === korisnickoIme);
            if (postojeci) {
                postojeci.tekst = tekst;
                postojeci.datum = new Date();
            } else {
                p.komentari.push({ korisnickoIme: korisnickoIme, tekst: tekst, datum: new Date() });
            }

            p.save().then(() => {
                res.json({ msg: 'Komentar je sacuvan.' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri cuvanju komentara!' });
        });
    }

    zaStampariju = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        Proizvod.find({ stamparijaKorisnickoIme: korisnickoIme }).then((proizvodi: any[]) => {
            res.json(proizvodi);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    azurirajProizvod = (req: express.Request, res: express.Response) => {
        let id = req.body._id;
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;

        Proizvod.findOne({ _id: id, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then((p: any) => {
            if (!p) {
                res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
                return;
            }

            if (req.body.naziv !== undefined) p.naziv = req.body.naziv;
            if (req.body.opis !== undefined) p.opis = req.body.opis;
            if (req.body.kategorija !== undefined) p.kategorija = req.body.kategorija;
            if (req.body.potkategorija !== undefined) p.potkategorija = req.body.potkategorija;
            if (req.body.jedinicnaCena !== undefined) p.jedinicnaCena = req.body.jedinicnaCena;
            if (req.body.kolicinaNaLageru !== undefined) p.kolicinaNaLageru = req.body.kolicinaNaLageru;
            if (req.body.dostupneBoje !== undefined) p.dostupneBoje = req.body.dostupneBoje;
            if (req.body.slikaUrl !== undefined) p.slikaUrl = req.body.slikaUrl;
            // najvise 3 dodatne slike - isto ogranicenje kao i svuda drugde u kodu
            if (req.body.dodatneSlike !== undefined) p.dodatneSlike = (req.body.dodatneSlike || []).slice(0, 3);

            p.save().then((azurirani: any) => {
                res.json(azurirani);
            }).catch((err: any) => {
                console.log(err);
                res.json({ msg: 'Greska pri azuriranju proizvoda!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri azuriranju proizvoda!' });
        });
    }

    obrisiProizvod = (req: express.Request, res: express.Response) => {
        let id = req.body._id;
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;

        Proizvod.deleteOne({ _id: id, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then((rezultat: any) => {
            if (rezultat.deletedCount === 0) {
                res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
            } else {
                res.json({ msg: 'Proizvod je obrisan.' });
            }
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri brisanju proizvoda!' });
        });
    }

    ucitajIzFajla = (req: express.Request, res: express.Response) => {
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
        let stavke = req.body.proizvodi || [];

        if (!Array.isArray(stavke) || stavke.length === 0) {
            res.json({ msg: 'Fajl ne sadrzi nijedan proizvod.' });
            return;
        }

        let neispravni: string[] = [];
        let noviProizvodi: any[] = [];

        stavke.forEach((s: any, indeks: number) => {
            if (!s.naziv || !s.sifra || !s.kategorija || !s.potkategorija || s.jedinicnaCena === undefined) {
                neispravni.push(`stavka ${indeks + 1} (nedostaju obavezna polja)`);
                return;
            }

            noviProizvodi.push({
                sifra: s.sifra,
                naziv: s.naziv,
                opis: s.opis || '',
                kategorija: s.kategorija,
                potkategorija: s.potkategorija,
                jedinicnaCena: s.jedinicnaCena,
                kolicinaNaLageru: s.kolicinaNaLageru || 0,
                dostupneBoje: s.dostupneBoje && s.dostupneBoje.length > 0 ? s.dostupneBoje : ['Bela'],
                slikaUrl: s.slikaUrl || '',
                dodatneSlike: s.dodatneSlike || [],
                uslugeStampe: s.uslugeStampe || [],
                stamparijaKorisnickoIme: stamparijaKorisnickoIme
            });
        });

        if (noviProizvodi.length === 0) {
            res.json({ msg: `Nijedna stavka nije ispravna (${neispravni.join(', ')}).` });
            return;
        }

        Proizvod.insertMany(noviProizvodi).then((sacuvani: any[]) => {
            let poruka = `Uspesno je uneto ${sacuvani.length} proizvoda.`;
            if (neispravni.length > 0) poruka += ` Preskoceno: ${neispravni.join(', ')}.`;
            res.json({ msg: poruka });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri unosu proizvoda iz fajla!' });
        });
    }

    otpremiSliku = (req: express.Request, res: express.Response) => {
        let sifra = req.body.sifra;
        let stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
        let slikaUrl = req.body.slikaUrl;
        let dodatneSlike = req.body.dodatneSlike;

        Proizvod.findOne({ sifra: sifra, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then((p: any) => {
            if (!p) {
                res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
                return;
            }

            if (slikaUrl !== undefined) p.slikaUrl = slikaUrl;
            // najvise 3 dodatne slike (isto ogranicenje kao i na strani sa detaljima proizvoda)
            if (dodatneSlike !== undefined) p.dodatneSlike = (dodatneSlike || []).slice(0, 3);

            p.save().then(() => {
                res.json({ msg: 'Slike su uspesno sacuvane.' });
            }).catch((err: any) => {
                console.log(err);
                res.json({ msg: 'Greska pri cuvanju slika!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri cuvanju slika!' });
        });
    }

    private napraviMapuStamparija = (stamparije: any[]): Map<string, any> => {
        let mapa = new Map<string, any>();
        stamparije.forEach(s => mapa.set(s.korisnickoIme, s));
        return mapa;
    }

    private izvuciGrad = (adresaSedista: string): string => {
        if (!adresaSedista) return '';
        let delovi = adresaSedista.split(',');
        return delovi[delovi.length - 1].trim();
    }
}

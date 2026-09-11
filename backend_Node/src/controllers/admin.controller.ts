import * as express from 'express';
import User from '../models/user';
import Proizvod from '../models/proizvod';
import Narudzbina from '../models/narudzbina';
import Nabavka from '../models/nabavka';
import Kategorija from '../models/kategorija';

export class AdminController {

    sviKorisnici = (req: express.Request, res: express.Response) => {
        User.find({ tip: { $ne: 'admin' } }, '-lozinka').sort({ aktivan: 1, korisnickoIme: 1 }).then(korisnici => {
            res.json(korisnici);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    odobriKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        User.findOneAndUpdate({ korisnickoIme: korisnickoIme }, { $set: { aktivan: true } }).then(() => {
            res.json({ msg: 'Nalog je odobren.' });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri odobravanju naloga!' });
        });
    }

    deaktivirajKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        User.findOneAndUpdate({ korisnickoIme: korisnickoIme }, { $set: { aktivan: false } }).then(() => {
            res.json({ msg: 'Nalog je deaktiviran.' });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri deaktiviranju naloga!' });
        });
    }

    azurirajKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        User.findOne({ korisnickoIme: korisnickoIme }).then(user => {
            if (!user) {
                res.json({ msg: 'Korisnik ne postoji.' });
                return;
            }

            if (req.body.ime !== undefined) user.ime = req.body.ime;
            if (req.body.prezime !== undefined) user.prezime = req.body.prezime;
            if (req.body.telefon !== undefined) user.telefon = req.body.telefon;
            if (req.body.email !== undefined) user.email = req.body.email;

            if (user.tip === 'pravno lice' || user.tip === 'stamparija') {
                if (req.body.nazivInstitucije !== undefined) user.nazivInstitucije = req.body.nazivInstitucije;
                if (req.body.adresaSedista !== undefined) user.adresaSedista = req.body.adresaSedista;
                if (req.body.MB !== undefined) user.MB = req.body.MB;
                if (req.body.PIB !== undefined) user.PIB = req.body.PIB;
            }

            user.save().then(azurirani => {
                res.json(azurirani);
            }).catch((err: any) => {
                console.log(err);
                if (err.code === 11000) {
                    if (err.keyPattern && err.keyPattern.email) {
                        res.json({ msg: 'Postoji vec nalog sa unetom e-mejl adresom.' });
                    } else if (err.keyPattern && err.keyPattern.MB) {
                        res.json({ msg: 'Institucija sa unetim maticnim brojem je vec registrovana.' });
                    } else if (err.keyPattern && err.keyPattern.PIB) {
                        res.json({ msg: 'Institucija sa unetim PIB-om je vec registrovana.' });
                    } else {
                        res.json({ msg: 'Neki od unetih podataka vec postoji u sistemu.' });
                    }
                    return;
                }
                res.json({ msg: 'Greska pri azuriranju korisnika!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri azuriranju korisnika!' });
        });
    }

    obrisiKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;

        User.deleteOne({ korisnickoIme: korisnickoIme, tip: { $ne: 'admin' } }).then((rezultat: any) => {
            if (rezultat.deletedCount === 0) {
                res.json({ msg: 'Korisnik ne postoji ili se ne moze obrisati.' });
            } else {
                res.json({ msg: 'Korisnik je obrisan.' });
            }
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri brisanju korisnika!' });
        });
    }

    statistika = (req: express.Request, res: express.Response) => {
        Promise.all([
            User.countDocuments({ tip: 'fizicko lice' }),
            User.countDocuments({ tip: 'pravno lice' }),
            User.countDocuments({ tip: 'stamparija' }),
            User.countDocuments({ aktivan: false, tip: { $ne: 'admin' } }),
            Proizvod.countDocuments({}),
            Kategorija.countDocuments({}),
            Narudzbina.find({}),
            Nabavka.find({})
        ]).then(([brojFizickih, brojPravnih, brojStamparija, brojNeaktivnih, brojProizvoda, brojKategorija, narudzbine, nabavke]) => {
            let brojNarudzbinaPoStatusu: any = { naruceno: 0, placeno: 0, 'u stampi': 0, isporuceno: 0, primljeno: 0 };
            let ukupanPromet = 0;

            narudzbine.forEach((n: any) => {
                brojNarudzbinaPoStatusu[n.status] = (brojNarudzbinaPoStatusu[n.status] || 0) + 1;
                if (n.status !== 'naruceno') ukupanPromet += n.ukupanIznos;
            });

            let brojNabavkiPoStatusu: any = { otvorena: 0, zatvorena: 0, zavrsena: 0 };
            nabavke.forEach((n: any) => {
                brojNabavkiPoStatusu[n.status] = (brojNabavkiPoStatusu[n.status] || 0) + 1;
            });

            res.json({
                brojFizickihLica: brojFizickih,
                brojPravnihLica: brojPravnih,
                brojStamparija: brojStamparija,
                brojNaloganaCekanju: brojNeaktivnih,
                brojProizvoda: brojProizvoda,
                brojKategorija: brojKategorija,
                ukupanBrojNarudzbina: narudzbine.length,
                brojNarudzbinaPoStatusu: brojNarudzbinaPoStatusu,
                ukupanPromet: ukupanPromet,
                ukupanBrojNabavki: nabavke.length,
                brojNabavkiPoStatusu: brojNabavkiPoStatusu
            });
        }).catch(err => {
            console.log(err);
            res.json(null);
        });
    }

    prometPoStamparijama = (req: express.Request, res: express.Response) => {
        let pocetak = new Date();
        pocetak.setMonth(pocetak.getMonth() - 3);

        Narudzbina.find({
            status: { $ne: 'naruceno' },
            datumNarucivanja: { $gte: pocetak }
        }).then((narudzbine: any[]) => {
            let promet: any = {};
            narudzbine.forEach((n: any) => {
                promet[n.stamparijaKorisnickoIme] = (promet[n.stamparijaKorisnickoIme] || 0) + n.ukupanIznos;
            });

            let korisnickaImena = Object.keys(promet);

            User.find({ korisnickoIme: { $in: korisnickaImena } }, 'korisnickoIme nazivInstitucije').then((stamparije: any[]) => {
                let nazivi: any = {};
                stamparije.forEach((s: any) => {
                    nazivi[s.korisnickoIme] = s.nazivInstitucije || s.korisnickoIme;
                });

                let lista = korisnickaImena.map(k => ({
                    stamparija: nazivi[k] || k,
                    promet: promet[k]
                })).sort((a, b) => b.promet - a.promet);

                res.json(lista);
            }).catch(err => {
                console.log(err);
                res.json([]);
            });
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    najtrazenijiProizvodiMesec = (req: express.Request, res: express.Response) => {
        let pocetak = new Date();
        pocetak.setDate(pocetak.getDate() - 30);

        Narudzbina.find({
            status: { $ne: 'naruceno' },
            datumNarucivanja: { $gte: pocetak }
        }).then((narudzbine: any[]) => {
            let kolicine: any = {};
            narudzbine.forEach((n: any) => {
                (n.stavke || []).forEach((s: any) => {
                    kolicine[s.naziv] = (kolicine[s.naziv] || 0) + s.kolicina;
                });
            });

            let ukupnaKolicina = Object.values(kolicine).reduce((zbir: number, k: any) => zbir + k, 0) as number;

            let lista = Object.keys(kolicine).map(naziv => ({
                naziv: naziv,
                kolicina: kolicine[naziv]
            })).sort((a, b) => b.kolicina - a.kolicina);

            let prvih7 = lista.slice(0, 7);
            let ostali = lista.slice(7);

            if (ostali.length > 0) {
                let ostaloKolicina = ostali.reduce((zbir, p) => zbir + p.kolicina, 0);
                prvih7.push({ naziv: 'Ostalo', kolicina: ostaloKolicina });
            }

            let rezultat = prvih7.map(p => ({
                naziv: p.naziv,
                kolicina: p.kolicina,
                procenat: ukupnaKolicina > 0 ? Math.round((p.kolicina / ukupnaKolicina) * 1000) / 10 : 0
            }));

            res.json(rezultat);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    ocenaProizvodaKrozVreme = (req: express.Request, res: express.Response) => {
        Proizvod.find({
            $or: [{ 'svidjanja.0': { $exists: true } }, { 'nesvidjanja.0': { $exists: true } }]
        }, 'naziv svidjanja nesvidjanja').then((proizvodi: any[]) => {
            let najaktivniji = proizvodi
                .slice()
                .sort((a: any, b: any) => (b.svidjanja.length + b.nesvidjanja.length) - (a.svidjanja.length + a.nesvidjanja.length))
                .slice(0, 8);

            let rezultat = najaktivniji.map((p: any) => {
                let dogadjaji = [
                    ...p.svidjanja.map((s: any) => ({ datum: s.datum, vrednost: 1 })),
                    ...p.nesvidjanja.map((s: any) => ({ datum: s.datum, vrednost: -1 }))
                ].sort((a: any, b: any) => new Date(a.datum).getTime() - new Date(b.datum).getTime());

                let zbir = 0;
                let tacke = dogadjaji.map((dogadjaj: any) => {
                    zbir += dogadjaj.vrednost;
                    return { t: new Date(dogadjaj.datum).getTime(), ocena: zbir };
                });

                return { naziv: p.naziv, tacke: tacke };
            });

            res.json(rezultat);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }
}

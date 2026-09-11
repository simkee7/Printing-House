import * as express from 'express';
import User from '../models/user';
import { zakljuciNabavkeZaKlijenta } from '../nabavkaEvaluacija';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const TRAJANJE_TOKENA_MS = 5 * 60 * 1000;// token za resetovanje lozinke vazi 5 minuta

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let lozinka = req.body.lozinka;

        User.findOne({ 'korisnickoIme': korisnickoIme}).then(user=>{
            if (!user) {
                res.json(null);
                return;
            }

            bcrypt.compare(lozinka, user.lozinka, async (err: any, same: boolean) => {
                if (err) {
                    console.log(err);
                    res.json(null);
                    return;
                }

                if (!same) {
                    res.json(null);
                    return;
                }

                if (user.tip === 'pravno lice') {
                    try {
                        await zakljuciNabavkeZaKlijenta(user.korisnickoIme);
                    } catch (err2) {
                        console.log('Greska pri zakljucivanju javnih nabavki prilikom prijave:', err2);
                    }
                }

                res.json(user);
            });
        }).catch(err=>{
            console.log(err)
            res.json(null);
        })
    }

    register = (req: express.Request, res: express.Response) => {
        let data = req.body;
        let ime = data.ime;
        let prezime = data.prezime;
        let korisnickoIme = data.korisnickoIme;
        let lozinka = data.lozinka;
        let tip = data.tip;
        let telefon = data.telefon;
        let email = data.email;
        let slika = data.slika;
        let nazivInstitucije = data.nazivInstitucije;
        let adresaSedista = data.adresaSedista;
        let MB = data.MB;
        let PIB = data.PIB;

        let dozvoljeniTipovi = ['fizicko lice', 'pravno lice', 'stamparija'];
        if (!dozvoljeniTipovi.includes(tip)) {
            res.json({ msg: 'Neuspesna registracija' });
            return;
        }

        let userObject: any = {
            ime: ime,
            prezime: prezime,
            korisnickoIme: korisnickoIme,
            lozinka: lozinka,
            tip: tip,
            telefon: telefon,
            email: email,
            slika: data.slika
        }

        if (nazivInstitucije) userObject.nazivInstitucije = nazivInstitucije;
        if (adresaSedista) userObject.adresaSedista = adresaSedista;
        if (MB) userObject.MB = MB;
        if (PIB) userObject.PIB = PIB;

        new User(userObject).save().then(ok=>{
            res.json({msg: "Uspesna registracija, ceka se odobrenje administratora"})
        }).catch((err) => {
            console.log(err)
            if (err.code === 11000) {
                if (err.keyPattern && err.keyPattern.korisnickoIme) {
                    res.json({ msg: "Korisnicko ime je vec zauzeto." });
                } else if (err.keyPattern && err.keyPattern.email) {
                    res.json({ msg: "Postoji vec nalog sa unetom e-mejl adresom." });
                } else if (err.keyPattern && err.keyPattern.MB) {
                    res.json({ msg: "Institucija sa unetim maticnim brojem je vec registrovana." });
                } else if (err.keyPattern && err.keyPattern.PIB) {
                    res.json({ msg: "Institucija sa unetim PIB-om je vec registrovana." });
                } else {
                    res.json({ msg: "Neki od unetih podataka vec postoji u sistemu." });
                }
                return;
            }
            res.json({msg: "Neuspesna registracija"})
        })
    }

    getUser = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        
        User.findOne({ 'korisnickoIme': korisnickoIme }).then(user=>{
            res.json(user)
        }).catch(err=>{
            console.log(err)
        })
    }

    promeniLozinku = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let staraLozinka = req.body.staraLozinka;
        let novaLozinka = req.body.novaLozinka;

        User.findOne({ 'korisnickoIme': korisnickoIme }).then(user => {
            if (!user) {
                res.json({ msg: 'Korisnik ne postoji' });
                return;
            }

            bcrypt.compare(staraLozinka, user.lozinka, (err: any, same: boolean) => {
                if (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri proveri lozinke!' });
                    return;
                }

                if (!same) {
                    res.json({ msg: 'Stara lozinka nije ispravna!' });
                    return;
                }
                if(staraLozinka == novaLozinka){
                    res.json({msg: 'Nova lozinka je ista kao i stara!'});
                    return;
                }
                user.lozinka = novaLozinka;
                user.save().then(() => {
                    res.json({ msg: 'Lozinka je uspesno promenjena!' });
                }).catch(err2 => {
                    console.log(err2);
                    res.json({ msg: 'Greska pri cuvanju nove lozinke!' });
                });
            });

        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri promeni lozinke!' });
        });
    }

    azurirajProfil = (req: express.Request, res: express.Response) => {
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
            if (req.body.slika !== undefined) user.slika = req.body.slika;

            if (user.tip === 'pravno lice' || user.tip === 'stamparija') {
                if (req.body.nazivInstitucije !== undefined) user.nazivInstitucije = req.body.nazivInstitucije;
                if (req.body.adresaSedista !== undefined) user.adresaSedista = req.body.adresaSedista;
                if (req.body.MB !== undefined) user.MB = req.body.MB;
                if (req.body.PIB !== undefined) user.PIB = req.body.PIB;
            }

            user.save().then(azurirani => {
                res.json(azurirani);
            }).catch((err) => {
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
                res.json({ msg: 'Greska pri azuriranju profila!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri azuriranju profila!' });
        });
    }

    getStamparija = (req: express.Request, res: express.Response) => {
        let nazivInstitucije = req.body.nazivInstitucije;

        User.findOne({ tip: 'stamparija', nazivInstitucije: nazivInstitucije }).then(user => {
            res.json(user ? user.adresaSedista : '');
        }).catch(err => {
            console.log(err);
            res.json('');
        });
    }

    zaboravljenaLozinka = (req: express.Request, res: express.Response) => {
        let identifikator = req.body.korisnickoIme || req.body.email;

        User.findOne({ $or: [{ korisnickoIme: identifikator }, { email: identifikator }] }).then(user => {
            if (!user) {
                res.json({ msg: 'Ne postoji korisnik sa unetim korisnickim imenom ili e-mejl adresom.' });
                return;
            }

            let token = crypto.randomBytes(32).toString('hex');
            user.tokenZaResetovanje = token;
            user.tokenIstice = new Date(Date.now() + TRAJANJE_TOKENA_MS);

            user.save().then(() => {
                let link = `http://localhost:4200/resetujLozinku/${token}`;
                res.json({ msg: 'Link za ponistavanje lozinke je kreiran. Link vazi 5 minuta.', link: link });
            }).catch(err2 => {
                console.log(err2);
                res.json({ msg: 'Greska pri kreiranju linka za resetovanje lozinke!' });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri obradi zahteva!' });
        });
    }

    resetujLozinku = (req: express.Request, res: express.Response) => {
        let token = req.body.token;
        let novaLozinka = req.body.novaLozinka;

        User.findOne({ tokenZaResetovanje: token }).then(user => {
            if (!user || !user.tokenIstice || user.tokenIstice.getTime() < Date.now()) {
                res.json({ msg: 'Link za resetovanje lozinke je nevazeci ili je istekao.' });
                return;
            }

            bcrypt.compare(novaLozinka, user.lozinka, (err: any, ista: boolean) => {
                if (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri proveri lozinke!' });
                    return;
                }

                if (ista) {
                    res.json({ msg: 'Nova lozinka je ista kao i stara! Postavite drugu lozinku.' });
                    return;
                }

                user.lozinka = novaLozinka;
                user.tokenZaResetovanje = undefined;
                user.tokenIstice = undefined;

                user.save().then(() => {
                    res.json({ msg: 'Lozinka je uspesno postavljena. Sada se mozete prijaviti.' });
                }).catch(err2 => {
                    console.log(err2);
                    res.json({ msg: 'Greska pri cuvanju nove lozinke!' });
                });
            });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri resetovanju lozinke!' });
        });
    }
}
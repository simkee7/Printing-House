"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
var user_1 = __importDefault(require("../models/user"));
var proizvod_1 = __importDefault(require("../models/proizvod"));
var narudzbina_1 = __importDefault(require("../models/narudzbina"));
var nabavka_1 = __importDefault(require("../models/nabavka"));
var kategorija_1 = __importDefault(require("../models/kategorija"));
var AdminController = /** @class */ (function () {
    function AdminController() {
        this.sviKorisnici = function (req, res) {
            user_1.default.find({ tip: { $ne: 'admin' } }, '-lozinka').sort({ aktivan: 1, korisnickoIme: 1 }).then(function (korisnici) {
                res.json(korisnici);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.odobriKorisnika = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            user_1.default.findOneAndUpdate({ korisnickoIme: korisnickoIme }, { $set: { aktivan: true } }).then(function () {
                res.json({ msg: 'Nalog je odobren.' });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri odobravanju naloga!' });
            });
        };
        this.deaktivirajKorisnika = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            user_1.default.findOneAndUpdate({ korisnickoIme: korisnickoIme }, { $set: { aktivan: false } }).then(function () {
                res.json({ msg: 'Nalog je deaktiviran.' });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri deaktiviranju naloga!' });
            });
        };
        this.azurirajKorisnika = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            user_1.default.findOne({ korisnickoIme: korisnickoIme }).then(function (user) {
                if (!user) {
                    res.json({ msg: 'Korisnik ne postoji.' });
                    return;
                }
                if (req.body.ime !== undefined)
                    user.ime = req.body.ime;
                if (req.body.prezime !== undefined)
                    user.prezime = req.body.prezime;
                if (req.body.telefon !== undefined)
                    user.telefon = req.body.telefon;
                if (req.body.email !== undefined)
                    user.email = req.body.email;
                if (user.tip === 'pravno lice' || user.tip === 'stamparija') {
                    if (req.body.nazivInstitucije !== undefined)
                        user.nazivInstitucije = req.body.nazivInstitucije;
                    if (req.body.adresaSedista !== undefined)
                        user.adresaSedista = req.body.adresaSedista;
                    if (req.body.MB !== undefined)
                        user.MB = req.body.MB;
                    if (req.body.PIB !== undefined)
                        user.PIB = req.body.PIB;
                }
                user.save().then(function (azurirani) {
                    res.json(azurirani);
                }).catch(function (err) {
                    console.log(err);
                    if (err.code === 11000) {
                        if (err.keyPattern && err.keyPattern.email) {
                            res.json({ msg: 'Postoji vec nalog sa unetom e-mejl adresom.' });
                        }
                        else if (err.keyPattern && err.keyPattern.MB) {
                            res.json({ msg: 'Institucija sa unetim maticnim brojem je vec registrovana.' });
                        }
                        else if (err.keyPattern && err.keyPattern.PIB) {
                            res.json({ msg: 'Institucija sa unetim PIB-om je vec registrovana.' });
                        }
                        else {
                            res.json({ msg: 'Neki od unetih podataka vec postoji u sistemu.' });
                        }
                        return;
                    }
                    res.json({ msg: 'Greska pri azuriranju korisnika!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri azuriranju korisnika!' });
            });
        };
        this.obrisiKorisnika = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            user_1.default.deleteOne({ korisnickoIme: korisnickoIme, tip: { $ne: 'admin' } }).then(function (rezultat) {
                if (rezultat.deletedCount === 0) {
                    res.json({ msg: 'Korisnik ne postoji ili se ne moze obrisati.' });
                }
                else {
                    res.json({ msg: 'Korisnik je obrisan.' });
                }
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri brisanju korisnika!' });
            });
        };
        this.statistika = function (req, res) {
            Promise.all([
                user_1.default.countDocuments({ tip: 'fizicko lice' }),
                user_1.default.countDocuments({ tip: 'pravno lice' }),
                user_1.default.countDocuments({ tip: 'stamparija' }),
                user_1.default.countDocuments({ aktivan: false, tip: { $ne: 'admin' } }),
                proizvod_1.default.countDocuments({}),
                kategorija_1.default.countDocuments({}),
                narudzbina_1.default.find({}),
                nabavka_1.default.find({})
            ]).then(function (_a) {
                var brojFizickih = _a[0], brojPravnih = _a[1], brojStamparija = _a[2], brojNeaktivnih = _a[3], brojProizvoda = _a[4], brojKategorija = _a[5], narudzbine = _a[6], nabavke = _a[7];
                var brojNarudzbinaPoStatusu = { naruceno: 0, placeno: 0, 'u stampi': 0, isporuceno: 0, primljeno: 0 };
                var ukupanPromet = 0;
                narudzbine.forEach(function (n) {
                    brojNarudzbinaPoStatusu[n.status] = (brojNarudzbinaPoStatusu[n.status] || 0) + 1;
                    if (n.status !== 'naruceno')
                        ukupanPromet += n.ukupanIznos;
                });
                var brojNabavkiPoStatusu = { otvorena: 0, zatvorena: 0, zavrsena: 0 };
                nabavke.forEach(function (n) {
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
            }).catch(function (err) {
                console.log(err);
                res.json(null);
            });
        };
        this.prometPoStamparijama = function (req, res) {
            var pocetak = new Date();
            pocetak.setMonth(pocetak.getMonth() - 3);
            narudzbina_1.default.find({
                status: { $ne: 'naruceno' },
                datumNarucivanja: { $gte: pocetak }
            }).then(function (narudzbine) {
                var promet = {};
                narudzbine.forEach(function (n) {
                    promet[n.stamparijaKorisnickoIme] = (promet[n.stamparijaKorisnickoIme] || 0) + n.ukupanIznos;
                });
                var korisnickaImena = Object.keys(promet);
                user_1.default.find({ korisnickoIme: { $in: korisnickaImena } }, 'korisnickoIme nazivInstitucije').then(function (stamparije) {
                    var nazivi = {};
                    stamparije.forEach(function (s) {
                        nazivi[s.korisnickoIme] = s.nazivInstitucije || s.korisnickoIme;
                    });
                    var lista = korisnickaImena.map(function (k) { return ({
                        stamparija: nazivi[k] || k,
                        promet: promet[k]
                    }); }).sort(function (a, b) { return b.promet - a.promet; });
                    res.json(lista);
                }).catch(function (err) {
                    console.log(err);
                    res.json([]);
                });
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.najtrazenijiProizvodiMesec = function (req, res) {
            var pocetak = new Date();
            pocetak.setDate(pocetak.getDate() - 30);
            narudzbina_1.default.find({
                status: { $ne: 'naruceno' },
                datumNarucivanja: { $gte: pocetak }
            }).then(function (narudzbine) {
                var kolicine = {};
                narudzbine.forEach(function (n) {
                    (n.stavke || []).forEach(function (s) {
                        kolicine[s.naziv] = (kolicine[s.naziv] || 0) + s.kolicina;
                    });
                });
                var ukupnaKolicina = Object.values(kolicine).reduce(function (zbir, k) { return zbir + k; }, 0);
                var lista = Object.keys(kolicine).map(function (naziv) { return ({
                    naziv: naziv,
                    kolicina: kolicine[naziv]
                }); }).sort(function (a, b) { return b.kolicina - a.kolicina; });
                var prvih7 = lista.slice(0, 7);
                var ostali = lista.slice(7);
                if (ostali.length > 0) {
                    var ostaloKolicina = ostali.reduce(function (zbir, p) { return zbir + p.kolicina; }, 0);
                    prvih7.push({ naziv: 'Ostalo', kolicina: ostaloKolicina });
                }
                var rezultat = prvih7.map(function (p) { return ({
                    naziv: p.naziv,
                    kolicina: p.kolicina,
                    procenat: ukupnaKolicina > 0 ? Math.round((p.kolicina / ukupnaKolicina) * 1000) / 10 : 0
                }); });
                res.json(rezultat);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.ocenaProizvodaKrozVreme = function (req, res) {
            proizvod_1.default.find({
                $or: [{ 'svidjanja.0': { $exists: true } }, { 'nesvidjanja.0': { $exists: true } }]
            }, 'naziv svidjanja nesvidjanja').then(function (proizvodi) {
                var najaktivniji = proizvodi
                    .slice()
                    .sort(function (a, b) { return (b.svidjanja.length + b.nesvidjanja.length) - (a.svidjanja.length + a.nesvidjanja.length); })
                    .slice(0, 8);
                var rezultat = najaktivniji.map(function (p) {
                    var dogadjaji = __spreadArray(__spreadArray([], p.svidjanja.map(function (s) { return ({ datum: s.datum, vrednost: 1 }); }), true), p.nesvidjanja.map(function (s) { return ({ datum: s.datum, vrednost: -1 }); }), true).sort(function (a, b) { return new Date(a.datum).getTime() - new Date(b.datum).getTime(); });
                    var zbir = 0;
                    var tacke = dogadjaji.map(function (dogadjaj) {
                        zbir += dogadjaj.vrednost;
                        return { t: new Date(dogadjaj.datum).getTime(), ocena: zbir };
                    });
                    return { naziv: p.naziv, tacke: tacke };
                });
                res.json(rezultat);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
    }
    return AdminController;
}());
exports.AdminController = AdminController;

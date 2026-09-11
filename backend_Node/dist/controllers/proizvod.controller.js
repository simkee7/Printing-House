"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProizvodController = void 0;
var proizvod_1 = __importDefault(require("../models/proizvod"));
var user_1 = __importDefault(require("../models/user"));
var crypto = require('crypto');
var ProizvodController = /** @class */ (function () {
    function ProizvodController() {
        var _this = this;
        this.dodaj = function (req, res) {
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            var naziv = req.body.naziv;
            var opis = req.body.opis;
            var kategorija = req.body.kategorija;
            var potkategorija = req.body.potkategorija;
            var jedinicnaCena = req.body.jedinicnaCena;
            var kolicinaNaLageru = req.body.kolicinaNaLageru;
            var dostupneBoje = req.body.dostupneBoje;
            var slikaUrl = req.body.slikaUrl;
            var dodatneSlike = req.body.dodatneSlike;
            var uslugeStampe = req.body.uslugeStampe;
            if (!stamparijaKorisnickoIme || !naziv || !kategorija || !potkategorija || jedinicnaCena === undefined || jedinicnaCena === null) {
                res.json({ msg: 'Popunite naziv, kategoriju, potkategoriju i jedinicnu cenu.' });
                return;
            }
            var sifra = 'PR-' + crypto.randomBytes(4).toString('hex').toUpperCase();
            var novi = new proizvod_1.default({
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
            novi.save().then(function (sacuvan) {
                res.json({ msg: 'Proizvod je uspesno dodat.', proizvod: sacuvan });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri dodavanju proizvoda!' });
            });
        };
        this.pocetna = function (req, res) {
            Promise.all([
                user_1.default.countDocuments({ tip: 'stamparija', aktivan: true }),
                proizvod_1.default.find({ kolicinaNaLageru: { $gt: 0 } }),
                user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije adresaSedista')
            ]).then(function (_a) {
                var brojStamparija = _a[0], proizvodi = _a[1], stamparije = _a[2];
                var mapa = _this.napraviMapuStamparija(stamparije);
                var top5 = proizvodi
                    .map(function (p) {
                    var _a;
                    return ({
                        _id: p._id,
                        naziv: p.naziv,
                        nazivStamparije: ((_a = mapa.get(p.stamparijaKorisnickoIme)) === null || _a === void 0 ? void 0 : _a.nazivInstitucije) || '',
                        brojSvidjanja: (p.svidjanja || []).length
                    });
                })
                    .sort(function (a, b) { return b.brojSvidjanja - a.brojSvidjanja; })
                    .slice(0, 5);
                res.json({ brojStamparija: brojStamparija, top5: top5 });
            }).catch(function (err) {
                console.log(err);
                res.json({ brojStamparija: 0, top5: [] });
            });
        };
        this.kategorije = function (req, res) {
            proizvod_1.default.distinct('kategorija', { kolicinaNaLageru: { $gt: 0 } }).then(function (kategorije) {
                res.json(kategorije);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.pretraga = function (req, res) {
            var naziv = req.body.naziv;
            var kategorija = req.body.kategorija;
            var uslov = { kolicinaNaLageru: { $gt: 0 } };
            if (naziv)
                uslov.naziv = { $regex: naziv, $options: 'i' };
            if (kategorija && kategorija !== 'Sve kategorije')
                uslov.kategorija = kategorija;
            Promise.all([
                proizvod_1.default.find(uslov),
                user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije adresaSedista')
            ]).then(function (_a) {
                var proizvodi = _a[0], stamparije = _a[1];
                var mapa = _this.napraviMapuStamparija(stamparije);
                var rezultat = proizvodi.map(function (p) {
                    var s = mapa.get(p.stamparijaKorisnickoIme);
                    return {
                        _id: p._id,
                        naziv: p.naziv,
                        kategorija: p.kategorija,
                        potkategorija: p.potkategorija,
                        jedinicnaCena: p.jedinicnaCena,
                        nazivStamparije: s ? s.nazivInstitucije : '',
                        grad: s ? _this.izvuciGrad(s.adresaSedista) : ''
                    };
                });
                res.json(rezultat);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.detalji = function (req, res) {
            var id = req.params.id;
            proizvod_1.default.findById(id).then(function (p) {
                if (!p) {
                    res.json(null);
                    return;
                }
                user_1.default.findOne({ korisnickoIme: p.stamparijaKorisnickoIme }, 'nazivInstitucije adresaSedista').then(function (s) {
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
                        grad: s ? _this.izvuciGrad(s.adresaSedista) : '',
                        brojSvidjanja: (p.svidjanja || []).length,
                        brojNesvidjanja: (p.nesvidjanja || []).length,
                        // poslednjih 5 komentara svih klijenata (najnoviji prvi)
                        poslednjiKomentari: (p.komentari || [])
                            .slice()
                            .sort(function (a, b) { return new Date(b.datum).getTime() - new Date(a.datum).getTime(); })
                            .slice(0, 5)
                            .map(function (k) { return ({ korisnickoIme: k.korisnickoIme, tekst: k.tekst, datum: k.datum }); })
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.json(null);
            });
        };
        this.svidi = function (req, res) {
            var sifra = req.body.sifra;
            var korisnickoIme = req.body.korisnickoIme;
            proizvod_1.default.findOne({ sifra: sifra }).then(function (p) {
                if (!p) {
                    res.json({ msg: 'Proizvod ne postoji.' });
                    return;
                }
                var vecPostoji = p.svidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; });
                if (!vecPostoji) {
                    p.svidjanja.push({ korisnickoIme: korisnickoIme, datum: new Date() });
                    var indeksNe = p.nesvidjanja.findIndex(function (s) { return s.korisnickoIme === korisnickoIme; });
                    if (indeksNe >= 0) {
                        p.nesvidjanja.splice(indeksNe, 1);
                    }
                }
                p.save().then(function () {
                    res.json({
                        brojSvidjanja: p.svidjanja.length,
                        brojNesvidjanja: p.nesvidjanja.length,
                        daLiSamSvideo: p.svidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; }),
                        daLiSamNesvideo: p.nesvidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; })
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri svidjanju proizvoda!' });
            });
        };
        this.nesvidi = function (req, res) {
            var sifra = req.body.sifra;
            var korisnickoIme = req.body.korisnickoIme;
            proizvod_1.default.findOne({ sifra: sifra }).then(function (p) {
                if (!p) {
                    res.json({ msg: 'Proizvod ne postoji.' });
                    return;
                }
                var vecPostoji = p.nesvidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; });
                if (!vecPostoji) {
                    p.nesvidjanja.push({ korisnickoIme: korisnickoIme, datum: new Date() });
                    var indeksDa = p.svidjanja.findIndex(function (s) { return s.korisnickoIme === korisnickoIme; });
                    if (indeksDa >= 0) {
                        p.svidjanja.splice(indeksDa, 1);
                    }
                }
                p.save().then(function () {
                    res.json({
                        brojSvidjanja: p.svidjanja.length,
                        brojNesvidjanja: p.nesvidjanja.length,
                        daLiSamSvideo: p.svidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; }),
                        daLiSamNesvideo: p.nesvidjanja.some(function (s) { return s.korisnickoIme === korisnickoIme; })
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri nesvidjanju proizvoda!' });
            });
        };
        this.komentarisi = function (req, res) {
            var sifra = req.body.sifra;
            var korisnickoIme = req.body.korisnickoIme;
            var tekst = req.body.tekst;
            proizvod_1.default.findOne({ sifra: sifra }).then(function (p) {
                if (!p) {
                    res.json({ msg: 'Proizvod ne postoji.' });
                    return;
                }
                var postojeci = p.komentari.find(function (k) { return k.korisnickoIme === korisnickoIme; });
                if (postojeci) {
                    postojeci.tekst = tekst;
                    postojeci.datum = new Date();
                }
                else {
                    p.komentari.push({ korisnickoIme: korisnickoIme, tekst: tekst, datum: new Date() });
                }
                p.save().then(function () {
                    res.json({ msg: 'Komentar je sacuvan.' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri cuvanju komentara!' });
            });
        };
        this.zaStampariju = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            proizvod_1.default.find({ stamparijaKorisnickoIme: korisnickoIme }).then(function (proizvodi) {
                res.json(proizvodi);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.azurirajProizvod = function (req, res) {
            var id = req.body._id;
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            proizvod_1.default.findOne({ _id: id, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then(function (p) {
                if (!p) {
                    res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
                    return;
                }
                if (req.body.naziv !== undefined)
                    p.naziv = req.body.naziv;
                if (req.body.opis !== undefined)
                    p.opis = req.body.opis;
                if (req.body.kategorija !== undefined)
                    p.kategorija = req.body.kategorija;
                if (req.body.potkategorija !== undefined)
                    p.potkategorija = req.body.potkategorija;
                if (req.body.jedinicnaCena !== undefined)
                    p.jedinicnaCena = req.body.jedinicnaCena;
                if (req.body.kolicinaNaLageru !== undefined)
                    p.kolicinaNaLageru = req.body.kolicinaNaLageru;
                if (req.body.dostupneBoje !== undefined)
                    p.dostupneBoje = req.body.dostupneBoje;
                if (req.body.slikaUrl !== undefined)
                    p.slikaUrl = req.body.slikaUrl;
                // najvise 3 dodatne slike - isto ogranicenje kao i svuda drugde u kodu
                if (req.body.dodatneSlike !== undefined)
                    p.dodatneSlike = (req.body.dodatneSlike || []).slice(0, 3);
                p.save().then(function (azurirani) {
                    res.json(azurirani);
                }).catch(function (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri azuriranju proizvoda!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri azuriranju proizvoda!' });
            });
        };
        this.obrisiProizvod = function (req, res) {
            var id = req.body._id;
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            proizvod_1.default.deleteOne({ _id: id, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then(function (rezultat) {
                if (rezultat.deletedCount === 0) {
                    res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
                }
                else {
                    res.json({ msg: 'Proizvod je obrisan.' });
                }
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri brisanju proizvoda!' });
            });
        };
        this.ucitajIzFajla = function (req, res) {
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            var stavke = req.body.proizvodi || [];
            if (!Array.isArray(stavke) || stavke.length === 0) {
                res.json({ msg: 'Fajl ne sadrzi nijedan proizvod.' });
                return;
            }
            var neispravni = [];
            var noviProizvodi = [];
            stavke.forEach(function (s, indeks) {
                if (!s.naziv || !s.sifra || !s.kategorija || !s.potkategorija || s.jedinicnaCena === undefined) {
                    neispravni.push("stavka ".concat(indeks + 1, " (nedostaju obavezna polja)"));
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
                res.json({ msg: "Nijedna stavka nije ispravna (".concat(neispravni.join(', '), ").") });
                return;
            }
            proizvod_1.default.insertMany(noviProizvodi).then(function (sacuvani) {
                var poruka = "Uspesno je uneto ".concat(sacuvani.length, " proizvoda.");
                if (neispravni.length > 0)
                    poruka += " Preskoceno: ".concat(neispravni.join(', '), ".");
                res.json({ msg: poruka });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri unosu proizvoda iz fajla!' });
            });
        };
        this.otpremiSliku = function (req, res) {
            var sifra = req.body.sifra;
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            var slikaUrl = req.body.slikaUrl;
            var dodatneSlike = req.body.dodatneSlike;
            proizvod_1.default.findOne({ sifra: sifra, stamparijaKorisnickoIme: stamparijaKorisnickoIme }).then(function (p) {
                if (!p) {
                    res.json({ msg: 'Proizvod ne postoji ili ne pripada vasoj stampariji.' });
                    return;
                }
                if (slikaUrl !== undefined)
                    p.slikaUrl = slikaUrl;
                // najvise 3 dodatne slike (isto ogranicenje kao i na strani sa detaljima proizvoda)
                if (dodatneSlike !== undefined)
                    p.dodatneSlike = (dodatneSlike || []).slice(0, 3);
                p.save().then(function () {
                    res.json({ msg: 'Slike su uspesno sacuvane.' });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri cuvanju slika!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri cuvanju slika!' });
            });
        };
        this.napraviMapuStamparija = function (stamparije) {
            var mapa = new Map();
            stamparije.forEach(function (s) { return mapa.set(s.korisnickoIme, s); });
            return mapa;
        };
        this.izvuciGrad = function (adresaSedista) {
            if (!adresaSedista)
                return '';
            var delovi = adresaSedista.split(',');
            return delovi[delovi.length - 1].trim();
        };
    }
    return ProizvodController;
}());
exports.ProizvodController = ProizvodController;

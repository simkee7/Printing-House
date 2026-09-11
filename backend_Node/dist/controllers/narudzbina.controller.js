"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarudzbinaController = void 0;
var narudzbina_1 = __importDefault(require("../models/narudzbina"));
var proizvod_1 = __importDefault(require("../models/proizvod"));
var user_1 = __importDefault(require("../models/user"));
var mailer_1 = require("../mailer");
var PDFDocument = require('pdfkit');
var NarudzbinaController = /** @class */ (function () {
    function NarudzbinaController() {
        var _this = this;
        // sve narudzbine (fakture) jednog klijenta - i prethodno realizovane i trenutno aktuelne
        this.mojeNarudzbine = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            narudzbina_1.default.find({ klijentKorisnickoIme: korisnickoIme }).sort({ datumNarucivanja: -1 }).then(function (narudzbine) { return __awaiter(_this, void 0, void 0, function () {
                var stamparije, mapa, rezultat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije')];
                        case 1:
                            stamparije = _a.sent();
                            mapa = new Map();
                            stamparije.forEach(function (s) { return mapa.set(s.korisnickoIme, s.nazivInstitucije); });
                            rezultat = narudzbine.map(function (n) { return ({
                                _id: n._id,
                                nazivStamparije: mapa.get(n.stamparijaKorisnickoIme) || n.stamparijaKorisnickoIme,
                                stavke: n.stavke,
                                ukupanIznos: n.ukupanIznos,
                                status: n.status,
                                datumNarucivanja: n.datumNarucivanja
                            }); });
                            res.json(rezultat);
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        // otkazivanje narudzbine - dozvoljeno samo dok je status "placeno" (stampa jos nije zapoceta).
        // Narudzbina se kreira odmah sa statusom "placeno" (nema vise posebnog koraka placanja), tako
        // da je to sada prvi status u kome se otkazivanje uopste ima smisla.
        this.otkazi = function (req, res) {
            var id = req.body.id;
            narudzbina_1.default.findById(id).then(function (n) {
                if (!n) {
                    res.json({ msg: 'Narudzbina ne postoji.' });
                    return;
                }
                if (n.status !== 'placeno') {
                    res.json({ msg: 'Narudzbina se vise ne moze otkazati (stampa je vec zapoceta ili je vec zavrsena).' });
                    return;
                }
                narudzbina_1.default.deleteOne({ _id: id }).then(function () {
                    res.json({ msg: 'Narudzbina je otkazana.' });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri otkazivanju narudzbine!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri otkazivanju narudzbine!' });
            });
        };
        // potvrda e-korpe (dugme "POTVRDI") - grupise stavke po stamparijama i pravi po jednu narudzbinu (fakturu)
        // za svaku stamparija, uz proveru da ima dovoljno svakog proizvoda na stanju. Narudzbina se
        // odmah kreira sa statusom "placeno" (nema posebnog koraka unosa kartice) i faktura se odmah
        // salje na mejl. Dozvoljeno je samo klijentima tipa "fizicko lice" - klijent tipa "pravno lice"
        // ide na javnu nabavku (NabavkaController.kreirajIzKorpe), provera mora da postoji i ovde jer se
        // do ove rute moze doci direktnim pozivom, mimo veb strane (na frontendu se to grana kroz ekorpa.ts).
        this.kreiraj = function (req, res) {
            var klijentKorisnickoIme = req.body.klijentKorisnickoIme;
            var stavke = req.body.stavke || [];
            if (stavke.length === 0) {
                res.json({ msg: 'Korpa je prazna.' });
                return;
            }
            user_1.default.findOne({ korisnickoIme: klijentKorisnickoIme }).then(function (korisnik) {
                if (korisnik && korisnik.tip === 'pravno lice') {
                    res.json({ msg: 'Klijenti tipa pravno lice narucuju kroz javnu nabavku, ne kroz redovnu e-korpu.' });
                    return;
                }
                _this.kreirajNarudzbinu(klijentKorisnickoIme, stavke, res);
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri proveri korisnika!' });
            });
        };
        // izdvojeno iz kreiraj() - stvarno kreiranje narudzbine(a)
        this.kreirajNarudzbinu = function (klijentKorisnickoIme, stavke, res) {
            Promise.all(stavke.map(function (s) { return s.sifra ? proizvod_1.default.findOne({ sifra: s.sifra }) : Promise.resolve(null); })).then(function (proizvodi) {
                for (var i = 0; i < stavke.length; i++) {
                    var p = proizvodi[i];
                    if (p && p.kolicinaNaLageru < stavke[i].kolicina) {
                        res.json({ msg: "Nema dovoljno proizvoda trenutno na stanju (".concat(stavke[i].naziv, ").") });
                        return;
                    }
                }
                // grupisanje stavki po stamparijama - jedna stamparija = jedna faktura
                var grupe = new Map();
                stavke.forEach(function (s) {
                    var lista = grupe.get(s.stamparijaKorisnickoIme) || [];
                    lista.push(s);
                    grupe.set(s.stamparijaKorisnickoIme, lista);
                });
                var noveNarudzbine = [];
                grupe.forEach(function (lista, stamparijaKorisnickoIme) {
                    var ukupanIznos = lista.reduce(function (zbir, s) { return zbir + s.kolicina * s.cenaPoKomadu; }, 0);
                    noveNarudzbine.push({
                        klijentKorisnickoIme: klijentKorisnickoIme,
                        stamparijaKorisnickoIme: stamparijaKorisnickoIme,
                        stavke: lista.map(function (s) { return ({
                            sifra: s.sifra,
                            naziv: s.naziv,
                            kolicina: s.kolicina,
                            tipStampe: s.tipStampe,
                            cenaPoKomadu: s.cenaPoKomadu
                        }); }),
                        ukupanIznos: ukupanIznos,
                        // nema vise posebnog koraka placanja - narudzbina se odmah smatra placenom i
                        // faktura se odmah generise/salje na mejl (ispod)
                        status: 'placeno'
                    });
                });
                narudzbina_1.default.insertMany(noveNarudzbine).then(function (sacuvane) {
                    // umanjujemo kolicinu na stanju za svaki naruceni proizvod
                    var umanjenja = stavke
                        .filter(function (s) { return s.sifra; })
                        .map(function (s) { return proizvod_1.default.findOneAndUpdate({ sifra: s.sifra }, { $inc: { kolicinaNaLageru: -s.kolicina } }); });
                    Promise.all(umanjenja).then(function () {
                        res.json({
                            msg: 'Narudzbina je uspesno kreirana. Faktura je poslata na Vasu e-mejl adresu.',
                            narudzbine: sacuvane.map(function (n) { return ({
                                _id: n._id,
                                stamparijaKorisnickoIme: n.stamparijaKorisnickoIme,
                                ukupanIznos: n.ukupanIznos
                            }); })
                        });
                        // Slanje fakture(a) na mejl klijenta - radi se u pozadini (posle odgovora korisniku),
                        // tako da eventualno sporo slanje mejla ne usporava kreiranje narudzbine.
                        user_1.default.findOne({ korisnickoIme: klijentKorisnickoIme }).then(function (klijent) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, n, stamparija, pdfBuffer, err_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!klijent || !klijent.email)
                                            return [2 /*return*/];
                                        _i = 0, _a = sacuvane;
                                        _b.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                                        n = _a[_i];
                                        _b.label = 2;
                                    case 2:
                                        _b.trys.push([2, 6, , 7]);
                                        return [4 /*yield*/, user_1.default.findOne({ korisnickoIme: n.stamparijaKorisnickoIme })];
                                    case 3:
                                        stamparija = _b.sent();
                                        return [4 /*yield*/, this.generisiFakturuBuffer(n, stamparija, klijent)];
                                    case 4:
                                        pdfBuffer = _b.sent();
                                        return [4 /*yield*/, (0, mailer_1.posaljiFakturuMejlom)(klijent.email, "".concat(klijent.ime, " ").concat(klijent.prezime), String(n._id), pdfBuffer)];
                                    case 5:
                                        _b.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        err_1 = _b.sent();
                                        console.log('Greska pri slanju fakture mejlom:', err_1);
                                        return [3 /*break*/, 7];
                                    case 7:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (err) { return console.log('Greska pri dohvatanju klijenta za slanje mejla:', err); });
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri kreiranju narudzbine!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri proveri stanja na lageru!' });
            });
        };
        // Arhiva proizvoda - narudzbine koje su vec isporucene ili primljene. Za primljene narudzbine
        // se uz svaku stavku vracaju i podaci potrebni za ocenjivanje/komentarisanje (samo ako stavka
        // ima sifru, tj. moze da se spoji sa stvarnim proizvodom u bazi preko te sifre).
        this.arhiva = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            narudzbina_1.default.find({ klijentKorisnickoIme: korisnickoIme, status: { $in: ['isporuceno', 'primljeno'] } })
                .sort({ datumNarucivanja: -1 })
                .then(function (narudzbine) { return __awaiter(_this, void 0, void 0, function () {
                var stamparije, mapaStamparija, sifreProizvoda, proizvodi, mapaProizvoda, rezultat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije')];
                        case 1:
                            stamparije = _a.sent();
                            mapaStamparija = new Map();
                            stamparije.forEach(function (s) { return mapaStamparija.set(s.korisnickoIme, s.nazivInstitucije); });
                            sifreProizvoda = [];
                            narudzbine.forEach(function (n) {
                                if (n.status === 'primljeno') {
                                    n.stavke.forEach(function (s) { if (s.sifra)
                                        sifreProizvoda.push(s.sifra); });
                                }
                            });
                            return [4 /*yield*/, proizvod_1.default.find({ sifra: { $in: sifreProizvoda } })];
                        case 2:
                            proizvodi = _a.sent();
                            mapaProizvoda = new Map();
                            proizvodi.forEach(function (p) { return mapaProizvoda.set(p.sifra, p); });
                            rezultat = narudzbine.map(function (n) { return ({
                                _id: n._id,
                                nazivStamparije: mapaStamparija.get(n.stamparijaKorisnickoIme) || n.stamparijaKorisnickoIme,
                                status: n.status,
                                datumNarucivanja: n.datumNarucivanja,
                                stavke: n.stavke.map(function (s) {
                                    var osnovno = {
                                        sifra: s.sifra,
                                        naziv: s.naziv,
                                        kolicina: s.kolicina,
                                        tipStampe: s.tipStampe,
                                        cenaPoKomadu: s.cenaPoKomadu
                                    };
                                    if (n.status === 'primljeno' && s.sifra) {
                                        var p = mapaProizvoda.get(s.sifra);
                                        if (p) {
                                            osnovno.brojSvidjanja = (p.svidjanja || []).length;
                                            osnovno.brojNesvidjanja = (p.nesvidjanja || []).length;
                                            osnovno.daLiSamSvideo = (p.svidjanja || []).some(function (s) { return s.korisnickoIme === korisnickoIme; });
                                            osnovno.daLiSamNesvideo = (p.nesvidjanja || []).some(function (s) { return s.korisnickoIme === korisnickoIme; });
                                            var mojKomentar = (p.komentari || []).find(function (k) { return k.korisnickoIme === korisnickoIme; });
                                            osnovno.mojKomentar = mojKomentar ? mojKomentar.tekst : '';
                                        }
                                    }
                                    return osnovno;
                                })
                            }); });
                            res.json(rezultat);
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        // Klijent potvrdjuje prijem narudzbine (dugme "Potvrdi prijem" u Arhivi proizvoda) - tek nakon ovoga
        // proizvodi iz te narudzbine postaju dostupni za ocenjivanje i komentarisanje
        this.potvrdiPrijem = function (req, res) {
            var id = req.body.id;
            narudzbina_1.default.findById(id).then(function (n) {
                if (!n) {
                    res.json({ msg: 'Narudzbina ne postoji.' });
                    return;
                }
                if (n.status !== 'isporuceno') {
                    res.json({ msg: 'Narudzbina jos nije isporucena.' });
                    return;
                }
                n.status = 'primljeno';
                n.save().then(function () {
                    res.json({ msg: 'Prijem je potvrdjen. Sada mozete da ocenite i komentarisete proizvode.' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri potvrdi prijema!' });
            });
        };
        // sve narudzbine (posao za odraditi) jedne stamparije
        this.zaStampariju = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            narudzbina_1.default.find({ stamparijaKorisnickoIme: korisnickoIme }).sort({ datumNarucivanja: -1 }).then(function (narudzbine) {
                res.json(narudzbine.map(function (n) { return ({
                    _id: n._id,
                    klijentKorisnickoIme: n.klijentKorisnickoIme,
                    stavke: n.stavke,
                    ukupanIznos: n.ukupanIznos,
                    status: n.status,
                    datumNarucivanja: n.datumNarucivanja
                }); }));
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        // stamparija pomera narudzbinu na sledeci korak u obradi: placeno -> u stampi -> isporuceno.
        // Narudzbina se kreira odmah sa statusom "placeno" (nema vise posebnog koraka placanja), a
        // isporuceno -> primljeno potvrdjuje klijent.
        this.sledeciKorak = function (req, res) {
            var id = req.body.id;
            var redosled = { 'placeno': 'u stampi', 'u stampi': 'isporuceno' };
            narudzbina_1.default.findById(id).then(function (n) {
                if (!n) {
                    res.json({ msg: 'Narudzbina ne postoji.' });
                    return;
                }
                var sledeci = redosled[n.status];
                if (!sledeci) {
                    res.json({ msg: 'Narudzbina se vise ne moze pomeriti u sledeci status.' });
                    return;
                }
                n.status = sledeci;
                n.save().then(function () {
                    res.json({ msg: "Status je promenjen u \"".concat(sledeci, "\".") });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri promeni statusa!' });
            });
        };
        // Izvestavanje - osnovna statistika za jednu stampariju: broj narudzbina po statusu, ukupan prihod
        // (samo od narudzbina koje su bar placene, "naruceno" se ne racuna) i najtrazeniji proizvodi po kolicini
        this.izvestaj = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            narudzbina_1.default.find({ stamparijaKorisnickoIme: korisnickoIme }).then(function (narudzbine) {
                var brojPoStatusu = { naruceno: 0, placeno: 0, 'u stampi': 0, isporuceno: 0, primljeno: 0 };
                var ukupanPrihod = 0;
                var prodajaPoProizvodu = new Map();
                narudzbine.forEach(function (n) {
                    brojPoStatusu[n.status] = (brojPoStatusu[n.status] || 0) + 1;
                    if (n.status !== 'naruceno') {
                        ukupanPrihod += n.ukupanIznos;
                        n.stavke.forEach(function (s) {
                            var unos = prodajaPoProizvodu.get(s.naziv) || { naziv: s.naziv, kolicina: 0, prihod: 0 };
                            unos.kolicina += s.kolicina;
                            unos.prihod += s.kolicina * s.cenaPoKomadu;
                            prodajaPoProizvodu.set(s.naziv, unos);
                        });
                    }
                });
                var najtrazeniji = Array.from(prodajaPoProizvodu.values())
                    .sort(function (a, b) { return b.kolicina - a.kolicina; })
                    .slice(0, 10);
                proizvod_1.default.find({ stamparijaKorisnickoIme: korisnickoIme }).then(function (proizvodi) {
                    res.json({
                        ukupanBrojNarudzbina: narudzbine.length,
                        brojNarudzbinaPoStatusu: brojPoStatusu,
                        ukupanPrihod: ukupanPrihod,
                        najtrazeniji: najtrazeniji,
                        brojProizvoda: proizvodi.length,
                        brojRasprodatihProizvoda: proizvodi.filter(function (p) { return p.kolicinaNaLageru === 0; }).length
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.json({ ukupanBrojNarudzbina: 0, brojNarudzbinaPoStatusu: {}, ukupanPrihod: 0, najtrazeniji: [], brojProizvoda: 0, brojRasprodatihProizvoda: 0 });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ ukupanBrojNarudzbina: 0, brojNarudzbinaPoStatusu: {}, ukupanPrihod: 0, najtrazeniji: [], brojProizvoda: 0, brojRasprodatihProizvoda: 0 });
            });
        };
        // generisanje PDF fakture za jednu narudzbinu, u obliku Buffer-a - koristi se i za
        // preuzimanje sa veb strane (faktura()), i za slanje u prilogu mejla (kreiraj())
        this.generisiFakturuBuffer = function (n, stamparija, klijent) {
            return new Promise(function (resolve, reject) {
                var doc = new PDFDocument();
                var delovi = [];
                doc.on('data', function (deo) { return delovi.push(deo); });
                doc.on('end', function () { return resolve(Buffer.concat(delovi)); });
                doc.on('error', function (err) { return reject(err); });
                doc.fontSize(18).text('Faktura', { align: 'center' });
                doc.moveDown();
                doc.fontSize(11);
                doc.text("Broj fakture: ".concat(n._id));
                doc.text("Datum narucivanja: ".concat(new Date(n.datumNarucivanja).toLocaleString('sr-RS')));
                doc.text("Stamparija: ".concat(stamparija ? stamparija.nazivInstitucije : n.stamparijaKorisnickoIme));
                doc.text("Klijent: ".concat(klijent ? (klijent.ime + ' ' + klijent.prezime) : n.klijentKorisnickoIme));
                doc.text("Status: ".concat(n.status));
                doc.moveDown();
                doc.text('Stavke:', { underline: true });
                n.stavke.forEach(function (s) {
                    doc.text("- ".concat(s.naziv, " ").concat(s.tipStampe ? '(' + s.tipStampe + ')' : '', " x ").concat(s.kolicina, " = ").concat(s.kolicina * s.cenaPoKomadu, " din"));
                });
                doc.moveDown();
                doc.fontSize(13).text("Ukupan iznos: ".concat(n.ukupanIznos, " din"), { align: 'right' });
                doc.end();
            });
        };
        // preuzimanje PDF fakture za jednu narudzbinu sa veb strane
        this.faktura = function (req, res) {
            var id = req.params.id;
            narudzbina_1.default.findById(id).then(function (n) { return __awaiter(_this, void 0, void 0, function () {
                var stamparija, klijent, pdfBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!n) {
                                res.status(404).send('Narudzbina ne postoji.');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, user_1.default.findOne({ korisnickoIme: n.stamparijaKorisnickoIme })];
                        case 1:
                            stamparija = _a.sent();
                            return [4 /*yield*/, user_1.default.findOne({ korisnickoIme: n.klijentKorisnickoIme })];
                        case 2:
                            klijent = _a.sent();
                            return [4 /*yield*/, this.generisiFakturuBuffer(n, stamparija, klijent)];
                        case 3:
                            pdfBuffer = _a.sent();
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', "attachment; filename=faktura_".concat(n._id, ".pdf"));
                            res.send(pdfBuffer);
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.status(500).send('Greska pri generisanju fakture.');
            });
        };
    }
    return NarudzbinaController;
}());
exports.NarudzbinaController = NarudzbinaController;

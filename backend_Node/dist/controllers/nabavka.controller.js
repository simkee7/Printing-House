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
exports.NabavkaController = void 0;
var nabavka_1 = __importDefault(require("../models/nabavka"));
var user_1 = __importDefault(require("../models/user"));
var mailer_1 = require("../mailer");
var PDFDocument = require('pdfkit');
var TRAJANJE_LICITACIJE_MS = 10 * 60 * 1000;
var NabavkaController = /** @class */ (function () {
    function NabavkaController() {
        var _this = this;
        this.zatvoriAkoJeIstekaoRok = function (n) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(n.status === 'otvorena' && n.rokZaPonude < new Date())) return [3 /*break*/, 2];
                        n.status = 'zatvorena';
                        return [4 /*yield*/, n.save()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, n];
                }
            });
        }); };
        this.kreirajIzKorpe = function (req, res) {
            var klijentKorisnickoIme = req.body.klijentKorisnickoIme;
            var stavke = req.body.stavke || [];
            if (stavke.length === 0) {
                res.json({ msg: 'Korpa je prazna.' });
                return;
            }
            user_1.default.findOne({ korisnickoIme: klijentKorisnickoIme }).then(function (korisnik) {
                if (!korisnik || korisnik.tip !== 'pravno lice') {
                    res.json({ msg: 'Javne nabavke mogu da kreiraju samo korisnici tipa pravno lice.' });
                    return;
                }
                var rokZaPonude = new Date(Date.now() + TRAJANJE_LICITACIJE_MS);
                var nova = new nabavka_1.default({
                    klijentKorisnickoIme: klijentKorisnickoIme,
                    stavke: stavke.map(function (s) { return ({
                        naziv: s.naziv,
                        kategorija: s.kategorija,
                        kolicina: s.kolicina,
                        orijentacionaCenaPoKomadu: s.cenaPoKomadu
                    }); }),
                    rokZaPonude: rokZaPonude
                });
                nova.save().then(function (sacuvana) { return __awaiter(_this, void 0, void 0, function () {
                    var stamparije, _i, _a, s, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                res.json({ msg: 'Zahtev za javnu nabavku je uspesno kreiran i prosledjen stamparijama. Licitacija traje 10 minuta.', nabavka: sacuvana });
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 7, , 8]);
                                return [4 /*yield*/, user_1.default.find({ tip: 'stamparija' })];
                            case 2:
                                stamparije = _b.sent();
                                _i = 0, _a = stamparije;
                                _b.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                s = _a[_i];
                                if (!s.email) return [3 /*break*/, 5];
                                return [4 /*yield*/, (0, mailer_1.posaljiObavestenjeONabavci)(s.email, sacuvana.stavke, sacuvana.rokZaPonude)];
                            case 4:
                                _b.sent();
                                _b.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 3];
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                err_1 = _b.sent();
                                console.log('Greska pri slanju obavestenja stamparijama o novoj javnoj nabavci:', err_1);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); }).catch(function (err) {
                    console.log(err);
                    res.json({ msg: 'Greska pri kreiranju javne nabavke!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri kreiranju javne nabavke!' });
            });
        };
        this.moje = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            nabavka_1.default.find({ klijentKorisnickoIme: korisnickoIme }).sort({ datumKreiranja: -1 }).then(function (nabavke) { return __awaiter(_this, void 0, void 0, function () {
                var azurirane, _i, nabavke_1, n, _a, _b, rezultat;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            azurirane = [];
                            _i = 0, nabavke_1 = nabavke;
                            _c.label = 1;
                        case 1:
                            if (!(_i < nabavke_1.length)) return [3 /*break*/, 4];
                            n = nabavke_1[_i];
                            _b = (_a = azurirane).push;
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            rezultat = azurirane.map(function (n) { return ({
                                _id: n._id,
                                stavke: n.stavke,
                                rokZaPonude: n.rokZaPonude,
                                status: n.status,
                                pobednikKorisnickoIme: n.pobednikKorisnickoIme,
                                brojPonuda: n.ponude.length
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
        this.otvorene = function (req, res) {
            nabavka_1.default.find({ status: { $ne: 'zavrsena' } }).then(function (nabavke) { return __awaiter(_this, void 0, void 0, function () {
                var azurirane, _i, nabavke_2, n, _a, _b, samoOtvorene;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            azurirane = [];
                            _i = 0, nabavke_2 = nabavke;
                            _c.label = 1;
                        case 1:
                            if (!(_i < nabavke_2.length)) return [3 /*break*/, 4];
                            n = nabavke_2[_i];
                            _b = (_a = azurirane).push;
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            samoOtvorene = azurirane.filter(function (n) { return n.status === 'otvorena'; });
                            res.json(samoOtvorene.map(function (n) { return ({
                                _id: n._id,
                                stavke: n.stavke,
                                rokZaPonude: n.rokZaPonude
                            }); }));
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.mojePonude = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            nabavka_1.default.find({ 'ponude.stamparijaKorisnickoIme': korisnickoIme }).sort({ datumKreiranja: -1 }).then(function (nabavke) { return __awaiter(_this, void 0, void 0, function () {
                var azurirane, _i, nabavke_3, n, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            azurirane = [];
                            _i = 0, nabavke_3 = nabavke;
                            _c.label = 1;
                        case 1:
                            if (!(_i < nabavke_3.length)) return [3 /*break*/, 4];
                            n = nabavke_3[_i];
                            _b = (_a = azurirane).push;
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            res.json(azurirane.map(function (n) {
                                var mojaPonuda = n.ponude.find(function (p) { return p.stamparijaKorisnickoIme === korisnickoIme; });
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
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.posaljiPonudu = function (req, res) {
            var nabavkaId = req.body.nabavkaId;
            var stamparijaKorisnickoIme = req.body.stamparijaKorisnickoIme;
            var cenaUkupno = req.body.cenaUkupno;
            var rokIsporukeDana = req.body.rokIsporukeDana;
            nabavka_1.default.findById(nabavkaId).then(function (n) { return __awaiter(_this, void 0, void 0, function () {
                var postojeca;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!n) {
                                res.json({ msg: 'Nabavka ne postoji.' });
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 1:
                            n = _a.sent();
                            if (n.status !== 'otvorena') {
                                res.json({ msg: 'Rok za dostavljanje ponuda je istekao.' });
                                return [2 /*return*/];
                            }
                            postojeca = n.ponude.find(function (p) { return p.stamparijaKorisnickoIme === stamparijaKorisnickoIme; });
                            if (postojeca) {
                                postojeca.cenaUkupno = cenaUkupno;
                                postojeca.rokIsporukeDana = rokIsporukeDana;
                                postojeca.datumPonude = new Date();
                            }
                            else {
                                n.ponude.push({
                                    stamparijaKorisnickoIme: stamparijaKorisnickoIme,
                                    cenaUkupno: cenaUkupno,
                                    rokIsporukeDana: rokIsporukeDana,
                                    datumPonude: new Date()
                                });
                            }
                            n.save().then(function () {
                                res.json({ msg: 'Ponuda je uspesno poslata.' });
                            });
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri slanju ponude!' });
            });
        };
        this.detalji = function (req, res) {
            var id = req.params.id;
            nabavka_1.default.findById(id).then(function (n) { return __awaiter(_this, void 0, void 0, function () {
                var stamparije, mapa;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!n) {
                                res.json(null);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 1:
                            n = _a.sent();
                            return [4 /*yield*/, user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije')];
                        case 2:
                            stamparije = _a.sent();
                            mapa = new Map();
                            stamparije.forEach(function (s) { return mapa.set(s.korisnickoIme, s.nazivInstitucije); });
                            res.json({
                                _id: n._id,
                                stavke: n.stavke,
                                rokZaPonude: n.rokZaPonude,
                                status: n.status,
                                pobednikKorisnickoIme: n.pobednikKorisnickoIme,
                                ponude: n.status === 'otvorena' ? [] : n.ponude.map(function (p) { return ({
                                    stamparijaKorisnickoIme: p.stamparijaKorisnickoIme,
                                    nazivStamparije: mapa.get(p.stamparijaKorisnickoIme) || p.stamparijaKorisnickoIme,
                                    cenaUkupno: p.cenaUkupno,
                                    rokIsporukeDana: p.rokIsporukeDana
                                }); })
                            });
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.json(null);
            });
        };
        this.izvestaj = function (req, res) {
            var id = req.params.id;
            nabavka_1.default.findById(id).then(function (n) { return __awaiter(_this, void 0, void 0, function () {
                var stamparije, mapa, doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!n) {
                                res.status(404).send('Nabavka ne postoji.');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.zatvoriAkoJeIstekaoRok(n)];
                        case 1:
                            n = _a.sent();
                            if (n.status === 'otvorena') {
                                res.status(400).send('Izvestaj jos nije dostupan - rok za ponude nije istekao.');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, user_1.default.find({ tip: 'stamparija' }, 'korisnickoIme nazivInstitucije')];
                        case 2:
                            stamparije = _a.sent();
                            mapa = new Map();
                            stamparije.forEach(function (s) { return mapa.set(s.korisnickoIme, s.nazivInstitucije); });
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', "attachment; filename=izvestaj_nabavka_".concat(n._id, ".pdf"));
                            doc = new PDFDocument();
                            doc.pipe(res);
                            doc.fontSize(18).text('Izvestaj o javnoj nabavci', { align: 'center' });
                            doc.moveDown();
                            doc.fontSize(11);
                            doc.text("Rok za dostavljanje ponuda: ".concat(new Date(n.rokZaPonude).toLocaleString('sr-RS')));
                            doc.text("Status: ".concat(n.status));
                            doc.moveDown();
                            doc.text('Trazeni proizvodi:', { underline: true });
                            n.stavke.forEach(function (s) {
                                doc.text("- ".concat(s.naziv).concat(s.kategorija ? ' (' + s.kategorija + ')' : '', " x ").concat(s.kolicina));
                            });
                            doc.moveDown();
                            doc.text('Pristigle ponude:', { underline: true });
                            if (n.ponude.length === 0) {
                                doc.text('Nije pristigla nijedna ponuda.');
                            }
                            else {
                                n.ponude.forEach(function (p) {
                                    var nazivStamparije = mapa.get(p.stamparijaKorisnickoIme) || p.stamparijaKorisnickoIme;
                                    var oznakaPobednika = n.pobednikKorisnickoIme === p.stamparijaKorisnickoIme ? ' [IZABRANI IZVODJAC]' : '';
                                    doc.text("- ".concat(nazivStamparije, ": ").concat(p.cenaUkupno, " din (ukupno), rok isporuke ").concat(p.rokIsporukeDana, " dana").concat(oznakaPobednika));
                                });
                            }
                            doc.end();
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
                res.status(500).send('Greska pri generisanju izvestaja.');
            });
        };
    }
    return NabavkaController;
}());
exports.NabavkaController = NabavkaController;

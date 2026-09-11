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
exports.UserController = void 0;
var user_1 = __importDefault(require("../models/user"));
var nabavkaEvaluacija_1 = require("../nabavkaEvaluacija");
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var TRAJANJE_TOKENA_MS = 5 * 60 * 1000; // token za resetovanje lozinke vazi 5 minuta
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.login = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            var lozinka = req.body.lozinka;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme }).then(function (user) {
                if (!user) {
                    res.json(null);
                    return;
                }
                bcrypt.compare(lozinka, user.lozinka, function (err, same) { return __awaiter(_this, void 0, void 0, function () {
                    var err2_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    console.log(err);
                                    res.json(null);
                                    return [2 /*return*/];
                                }
                                if (!same) {
                                    res.json(null);
                                    return [2 /*return*/];
                                }
                                if (!(user.tip === 'pravno lice')) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, nabavkaEvaluacija_1.zakljuciNabavkeZaKlijenta)(user.korisnickoIme)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                err2_1 = _a.sent();
                                console.log('Greska pri zakljucivanju javnih nabavki prilikom prijave:', err2_1);
                                return [3 /*break*/, 4];
                            case 4:
                                res.json(user);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }).catch(function (err) {
                console.log(err);
                res.json(null);
            });
        };
        this.register = function (req, res) {
            var data = req.body;
            var ime = data.ime;
            var prezime = data.prezime;
            var korisnickoIme = data.korisnickoIme;
            var lozinka = data.lozinka;
            var tip = data.tip;
            var telefon = data.telefon;
            var email = data.email;
            var slika = data.slika;
            var nazivInstitucije = data.nazivInstitucije;
            var adresaSedista = data.adresaSedista;
            var MB = data.MB;
            var PIB = data.PIB;
            var dozvoljeniTipovi = ['fizicko lice', 'pravno lice', 'stamparija'];
            if (!dozvoljeniTipovi.includes(tip)) {
                res.json({ msg: 'Neuspesna registracija' });
                return;
            }
            var userObject = {
                ime: ime,
                prezime: prezime,
                korisnickoIme: korisnickoIme,
                lozinka: lozinka,
                tip: tip,
                telefon: telefon,
                email: email,
                slika: data.slika
            };
            if (nazivInstitucije)
                userObject.nazivInstitucije = nazivInstitucije;
            if (adresaSedista)
                userObject.adresaSedista = adresaSedista;
            if (MB)
                userObject.MB = MB;
            if (PIB)
                userObject.PIB = PIB;
            new user_1.default(userObject).save().then(function (ok) {
                res.json({ msg: "Uspesna registracija, ceka se odobrenje administratora" });
            }).catch(function (err) {
                console.log(err);
                if (err.code === 11000) {
                    if (err.keyPattern && err.keyPattern.korisnickoIme) {
                        res.json({ msg: "Korisnicko ime je vec zauzeto." });
                    }
                    else if (err.keyPattern && err.keyPattern.email) {
                        res.json({ msg: "Postoji vec nalog sa unetom e-mejl adresom." });
                    }
                    else if (err.keyPattern && err.keyPattern.MB) {
                        res.json({ msg: "Institucija sa unetim maticnim brojem je vec registrovana." });
                    }
                    else if (err.keyPattern && err.keyPattern.PIB) {
                        res.json({ msg: "Institucija sa unetim PIB-om je vec registrovana." });
                    }
                    else {
                        res.json({ msg: "Neki od unetih podataka vec postoji u sistemu." });
                    }
                    return;
                }
                res.json({ msg: "Neuspesna registracija" });
            });
        };
        this.getUser = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme }).then(function (user) {
                res.json(user);
            }).catch(function (err) {
                console.log(err);
            });
        };
        this.promeniLozinku = function (req, res) {
            var korisnickoIme = req.body.korisnickoIme;
            var staraLozinka = req.body.staraLozinka;
            var novaLozinka = req.body.novaLozinka;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme }).then(function (user) {
                if (!user) {
                    res.json({ msg: 'Korisnik ne postoji' });
                    return;
                }
                bcrypt.compare(staraLozinka, user.lozinka, function (err, same) {
                    if (err) {
                        console.log(err);
                        res.json({ msg: 'Greska pri proveri lozinke!' });
                        return;
                    }
                    if (!same) {
                        res.json({ msg: 'Stara lozinka nije ispravna!' });
                        return;
                    }
                    if (staraLozinka == novaLozinka) {
                        res.json({ msg: 'Nova lozinka je ista kao i stara!' });
                        return;
                    }
                    user.lozinka = novaLozinka;
                    user.save().then(function () {
                        res.json({ msg: 'Lozinka je uspesno promenjena!' });
                    }).catch(function (err2) {
                        console.log(err2);
                        res.json({ msg: 'Greska pri cuvanju nove lozinke!' });
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri promeni lozinke!' });
            });
        };
        this.azurirajProfil = function (req, res) {
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
                if (req.body.slika !== undefined)
                    user.slika = req.body.slika;
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
                    res.json({ msg: 'Greska pri azuriranju profila!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri azuriranju profila!' });
            });
        };
        this.getStamparija = function (req, res) {
            var nazivInstitucije = req.body.nazivInstitucije;
            user_1.default.findOne({ tip: 'stamparija', nazivInstitucije: nazivInstitucije }).then(function (user) {
                res.json(user ? user.adresaSedista : '');
            }).catch(function (err) {
                console.log(err);
                res.json('');
            });
        };
        this.zaboravljenaLozinka = function (req, res) {
            var identifikator = req.body.korisnickoIme || req.body.email;
            user_1.default.findOne({ $or: [{ korisnickoIme: identifikator }, { email: identifikator }] }).then(function (user) {
                if (!user) {
                    res.json({ msg: 'Ne postoji korisnik sa unetim korisnickim imenom ili e-mejl adresom.' });
                    return;
                }
                var token = crypto.randomBytes(32).toString('hex');
                user.tokenZaResetovanje = token;
                user.tokenIstice = new Date(Date.now() + TRAJANJE_TOKENA_MS);
                user.save().then(function () {
                    var link = "http://localhost:4200/resetujLozinku/".concat(token);
                    res.json({ msg: 'Link za ponistavanje lozinke je kreiran. Link vazi 5 minuta.', link: link });
                }).catch(function (err2) {
                    console.log(err2);
                    res.json({ msg: 'Greska pri kreiranju linka za resetovanje lozinke!' });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri obradi zahteva!' });
            });
        };
        this.resetujLozinku = function (req, res) {
            var token = req.body.token;
            var novaLozinka = req.body.novaLozinka;
            user_1.default.findOne({ tokenZaResetovanje: token }).then(function (user) {
                if (!user || !user.tokenIstice || user.tokenIstice.getTime() < Date.now()) {
                    res.json({ msg: 'Link za resetovanje lozinke je nevazeci ili je istekao.' });
                    return;
                }
                bcrypt.compare(novaLozinka, user.lozinka, function (err, ista) {
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
                    user.save().then(function () {
                        res.json({ msg: 'Lozinka je uspesno postavljena. Sada se mozete prijaviti.' });
                    }).catch(function (err2) {
                        console.log(err2);
                        res.json({ msg: 'Greska pri cuvanju nove lozinke!' });
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri resetovanju lozinke!' });
            });
        };
    }
    return UserController;
}());
exports.UserController = UserController;

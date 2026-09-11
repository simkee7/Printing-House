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
exports.zakljuciNabavkeZaKlijenta = zakljuciNabavkeZaKlijenta;
var nabavka_1 = __importDefault(require("./models/nabavka"));
var proizvod_1 = __importDefault(require("./models/proizvod"));
var narudzbina_1 = __importDefault(require("./models/narudzbina"));
function escapeRegExp(tekst) {
    return tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function imaDovoljnoNaStanju(stamparijaKorisnickoIme, stavke) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, stavke_1, s, proizvod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, stavke_1 = stavke;
                    _a.label = 1;
                case 1:
                    if (!(_i < stavke_1.length)) return [3 /*break*/, 4];
                    s = stavke_1[_i];
                    return [4 /*yield*/, proizvod_1.default.findOne({
                            stamparijaKorisnickoIme: stamparijaKorisnickoIme,
                            naziv: new RegExp('^' + escapeRegExp(s.naziv) + '$', 'i')
                        })];
                case 2:
                    proizvod = _a.sent();
                    if (!proizvod || proizvod.kolicinaNaLageru < s.kolicina) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, true];
            }
        });
    });
}
function rasporediCenu(stavke, cenaUkupno) {
    var ukupnaTezina = stavke.reduce(function (zbir, s) { return zbir + s.kolicina * (s.orijentacionaCenaPoKomadu || 0); }, 0);
    return stavke.map(function (s) {
        var tezina = s.kolicina * (s.orijentacionaCenaPoKomadu || 0);
        var udeo = ukupnaTezina > 0 ? tezina / ukupnaTezina : (1 / stavke.length);
        var cenaZaStavku = cenaUkupno * udeo;
        return {
            naziv: s.naziv,
            kolicina: s.kolicina,
            tipStampe: s.kategorija,
            cenaPoKomadu: s.kolicina > 0 ? cenaZaStavku / s.kolicina : cenaZaStavku
        };
    });
}
function zakljuciNabavkeZaKlijenta(klijentKorisnickoIme) {
    return __awaiter(this, void 0, void 0, function () {
        var nabavke, _i, _a, n, ponudePoCeni, pobednickaPonuda, _b, ponudePoCeni_1, p, stavkeZaFakturu, novaNarudzbina, _c, _d, s, err_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, nabavka_1.default.find({ klijentKorisnickoIme: klijentKorisnickoIme, status: { $ne: 'zavrsena' } })];
                case 1:
                    nabavke = _e.sent();
                    _i = 0, _a = nabavke;
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 20];
                    n = _a[_i];
                    if (!(n.status === 'otvorena' && n.rokZaPonude < new Date())) return [3 /*break*/, 4];
                    n.status = 'zatvorena';
                    return [4 /*yield*/, n.save()];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (n.status !== 'zatvorena')
                        return [3 /*break*/, 19];
                    ponudePoCeni = __spreadArray([], n.ponude, true).sort(function (a, b) { return a.cenaUkupno - b.cenaUkupno; });
                    pobednickaPonuda = null;
                    _b = 0, ponudePoCeni_1 = ponudePoCeni;
                    _e.label = 5;
                case 5:
                    if (!(_b < ponudePoCeni_1.length)) return [3 /*break*/, 8];
                    p = ponudePoCeni_1[_b];
                    return [4 /*yield*/, imaDovoljnoNaStanju(p.stamparijaKorisnickoIme, n.stavke)];
                case 6:
                    if (_e.sent()) {
                        pobednickaPonuda = p;
                        return [3 /*break*/, 8];
                    }
                    _e.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8:
                    n.status = 'zavrsena';
                    if (!!pobednickaPonuda) return [3 /*break*/, 10];
                    return [4 /*yield*/, n.save()];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 19];
                case 10:
                    n.pobednikKorisnickoIme = pobednickaPonuda.stamparijaKorisnickoIme;
                    return [4 /*yield*/, n.save()];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    _e.trys.push([12, 18, , 19]);
                    stavkeZaFakturu = rasporediCenu(n.stavke, pobednickaPonuda.cenaUkupno);
                    novaNarudzbina = new narudzbina_1.default({
                        klijentKorisnickoIme: n.klijentKorisnickoIme,
                        stamparijaKorisnickoIme: pobednickaPonuda.stamparijaKorisnickoIme,
                        stavke: stavkeZaFakturu,
                        ukupanIznos: pobednickaPonuda.cenaUkupno,
                        status: 'u stampi'
                    });
                    return [4 /*yield*/, novaNarudzbina.save()];
                case 13:
                    _e.sent();
                    _c = 0, _d = n.stavke;
                    _e.label = 14;
                case 14:
                    if (!(_c < _d.length)) return [3 /*break*/, 17];
                    s = _d[_c];
                    return [4 /*yield*/, proizvod_1.default.findOneAndUpdate({
                            stamparijaKorisnickoIme: pobednickaPonuda.stamparijaKorisnickoIme,
                            naziv: new RegExp('^' + escapeRegExp(s.naziv) + '$', 'i')
                        }, { $inc: { kolicinaNaLageru: -s.kolicina } })];
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16:
                    _c++;
                    return [3 /*break*/, 14];
                case 17: return [3 /*break*/, 19];
                case 18:
                    err_1 = _e.sent();
                    console.log('Greska pri kreiranju narudzbine za pobednicku ponudu javne nabavke:', err_1);
                    return [3 /*break*/, 19];
                case 19:
                    _i++;
                    return [3 /*break*/, 2];
                case 20: return [2 /*return*/];
            }
        });
    });
}

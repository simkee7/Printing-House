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
Object.defineProperty(exports, "__esModule", { value: true });
exports.posaljiFakturuMejlom = posaljiFakturuMejlom;
exports.posaljiObavestenjeONabavci = posaljiObavestenjeONabavci;
var nodemailer = require('nodemailer');
var transporterPromise = null;
function napraviTransporter() {
    var _this = this;
    if (!transporterPromise) {
        transporterPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
            var testNalog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (process.env.SMTP_HOST) {
                            return [2 /*return*/, nodemailer.createTransport({
                                    host: process.env.SMTP_HOST,
                                    port: Number(process.env.SMTP_PORT) || 587,
                                    secure: false,
                                    auth: process.env.SMTP_USER
                                        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                                        : undefined
                                })];
                        }
                        return [4 /*yield*/, nodemailer.createTestAccount()];
                    case 1:
                        testNalog = _a.sent();
                        return [2 /*return*/, nodemailer.createTransport({
                                host: 'smtp.ethereal.email',
                                port: 587,
                                secure: false,
                                auth: { user: testNalog.user, pass: testNalog.pass }
                            })];
                }
            });
        }); })();
    }
    return transporterPromise;
}
function posaljiMejl(opcije) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, info, previewUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opcije.to)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, napraviTransporter()];
                case 2:
                    transporter = _a.sent();
                    return [4 /*yield*/, transporter.sendMail({
                            from: '"Printing House" <no-reply@printinghouse.rs>',
                            to: opcije.to,
                            subject: opcije.subject,
                            text: opcije.text,
                            attachments: opcije.attachments
                        })];
                case 3:
                    info = _a.sent();
                    previewUrl = nodemailer.getTestMessageUrl(info);
                    if (previewUrl) {
                        console.log("Mejl \"".concat(opcije.subject, "\" poslat (test nalog) - pregled: ").concat(previewUrl));
                    }
                    else {
                        console.log("Mejl \"".concat(opcije.subject, "\" uspesno poslat na ").concat(opcije.to, "."));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log('Greska pri slanju mejla:', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function posaljiFakturuMejlom(email, imeKlijenta, brojFakture, pdfBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, posaljiMejl({
                        to: email,
                        subject: "Faktura br. ".concat(brojFakture),
                        text: "Postovani/a ".concat(imeKlijenta, ",\n\nU prilogu se nalazi faktura za Vasu narudzbinu br. ").concat(brojFakture, ".\n\nHvala na poverenju."),
                        attachments: [
                            { filename: "faktura_".concat(brojFakture, ".pdf"), content: pdfBuffer }
                        ]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function posaljiObavestenjeONabavci(email, stavke, rokZaPonude) {
    return __awaiter(this, void 0, void 0, function () {
        var spisak;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spisak = stavke.map(function (s) { return "- ".concat(s.naziv).concat(s.kategorija ? ' (' + s.kategorija + ')' : '', " x ").concat(s.kolicina); }).join('\n');
                    return [4 /*yield*/, posaljiMejl({
                            to: email,
                            subject: 'Otvorena je nova javna nabavka',
                            text: "Postovani,\n\nOtvorena je licitacija za novu javnu nabavku. Trazeni proizvodi:\n\n".concat(spisak, "\n\nRok za dostavljanje ponuda: ").concat(new Date(rokZaPonude).toLocaleString('sr-RS'), ".\n\nPonudu mozete poslati prijavom na sistem, u okviru stranice za javne nabavke.")
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}

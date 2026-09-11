"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var StavkaNarudzbine = new Schema({
    sifra: String,
    naziv: String,
    kolicina: Number,
    tipStampe: String,
    cenaPoKomadu: Number
}, { _id: false });
var Narudzbina = new Schema({
    klijentKorisnickoIme: {
        type: String,
        required: true
    },
    stamparijaKorisnickoIme: {
        type: String,
        required: true
    },
    stavke: {
        type: [StavkaNarudzbine],
        default: []
    },
    ukupanIznos: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['naruceno', 'placeno', 'u stampi', 'isporuceno', 'primljeno'],
        default: 'naruceno'
    },
    datumNarucivanja: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Narudzbina', Narudzbina, 'narudzbine');

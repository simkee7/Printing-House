"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var UslugaStampe = new Schema({
    idUsluge: String,
    tipStampe: String,
    dodatnaCenaPoKomadu: Number,
    maxSirinaMm: Number,
    maxVisinaMm: Number
}, { _id: false });
var Komentar = new Schema({
    korisnickoIme: String,
    tekst: String,
    datum: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
var OcenaKorisnika = new Schema({
    korisnickoIme: String,
    datum: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
var Proizvod = new Schema({
    sifra: {
        type: String,
        required: true
    },
    naziv: {
        type: String,
        required: true
    },
    opis: String,
    kategorija: {
        type: String,
        required: true
    },
    potkategorija: {
        type: String,
        required: true
    },
    jedinicnaCena: {
        type: Number,
        required: true
    },
    kolicinaNaLageru: {
        type: Number,
        required: true,
        default: 0
    },
    dostupneBoje: {
        type: [String],
        default: ['Bela']
    },
    slikaUrl: {
        type: String,
        default: ''
    },
    dodatneSlike: {
        type: [String],
        default: []
    },
    uslugeStampe: {
        type: [UslugaStampe],
        default: []
    },
    stamparijaKorisnickoIme: {
        type: String,
        required: true
    },
    svidjanja: {
        type: [OcenaKorisnika],
        default: []
    },
    nesvidjanja: {
        type: [OcenaKorisnika],
        default: []
    },
    komentari: {
        type: [Komentar],
        default: []
    }
});
exports.default = mongoose_1.default.model('Proizvod', Proizvod, 'proizvodi');

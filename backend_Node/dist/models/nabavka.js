"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var StavkaNabavke = new Schema({
    naziv: String,
    kategorija: String,
    kolicina: Number,
    orijentacionaCenaPoKomadu: Number
}, { _id: false });
var Ponuda = new Schema({
    stamparijaKorisnickoIme: String,
    cenaUkupno: Number,
    rokIsporukeDana: Number,
    datumPonude: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
var Nabavka = new Schema({
    klijentKorisnickoIme: {
        type: String,
        required: true
    },
    stavke: {
        type: [StavkaNabavke],
        default: []
    },
    rokZaPonude: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['otvorena', 'zatvorena', 'zavrsena'],
        default: 'otvorena'
    },
    ponude: {
        type: [Ponuda],
        default: []
    },
    pobednikKorisnickoIme: String,
    datumKreiranja: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Nabavka', Nabavka, 'nabavke');

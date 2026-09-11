import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let UslugaStampe = new Schema({
    idUsluge: String,
    tipStampe: String,
    dodatnaCenaPoKomadu: Number,
    maxSirinaMm: Number,
    maxVisinaMm: Number
}, { _id: false });

let Komentar = new Schema({
    korisnickoIme: String,
    tekst: String,
    datum: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let OcenaKorisnika = new Schema({
    korisnickoIme: String,
    datum: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let Proizvod = new Schema({
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

export default mongoose.model('Proizvod', Proizvod, 'proizvodi');
